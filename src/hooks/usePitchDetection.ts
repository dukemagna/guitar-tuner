import {
  getRecordingPermissionsAsync,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
  type AudioStreamBuffer,
} from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import type { GuitarString, InstrumentId, NoteName } from '../data/tunings';
import {
  centsBetween,
  closestStringIndex,
  nearestNote,
  stringFrequency,
} from '../utils/notes';
import { detectPitch, resolveInstrumentFrequency } from '../utils/pitch';

const TARGET_SAMPLES = 2400;
const RING_SIZE = TARGET_SAMPLES * 2;
const SILENCE_MS = 320;
const UI_MS = 90;
const YIN_MS = 90;

export type PermissionState = 'undetermined' | 'granted' | 'denied';

export type TunerReading = {
  frequency: number;
  cents: number;
  noteName: NoteName;
  octave: number;
  stringIndex: number | null;
  inTune: boolean;
};

type Range = { min: number; max: number };

const RANGES: Record<InstrumentId, Range> = {
  auto: { min: 28, max: 2000 },
  guitar: { min: 60, max: 1400 },
  bass: { min: 28, max: 500 },
  saz: { min: 70, max: 900 },
  ukulele: { min: 180, max: 900 },
};

function asArrayBuffer(data: AudioStreamBuffer['data']): ArrayBuffer | null {
  if (data instanceof ArrayBuffer) {
    return data.slice(0);
  }
  return null;
}

function toMonoFloat32(buffer: AudioStreamBuffer): Float32Array {
  const channels = Math.max(1, buffer.channels ?? 1);
  const bytes = asArrayBuffer(buffer.data);
  if (!bytes || bytes.byteLength < 2) {
    return new Float32Array(0);
  }

  const ints = new Int16Array(bytes, 0, Math.floor(bytes.byteLength / 2));
  const floats = new Float32Array(ints.length);
  for (let i = 0; i < ints.length; i += 1) {
    floats[i] = ints[i] / 32768;
  }
  if (channels === 1) {
    return floats;
  }
  const frames = Math.floor(floats.length / channels);
  const mono = new Float32Array(frames);
  for (let i = 0; i < frames; i += 1) {
    let sum = 0;
    for (let c = 0; c < channels; c += 1) {
      sum += floats[i * channels + c];
    }
    mono[i] = sum / channels;
  }
  return mono;
}

function writeRing(ring: Float32Array, writeAt: number, samples: Float32Array): number {
  let pos = writeAt;
  for (let i = 0; i < samples.length; i += 1) {
    ring[pos] = samples[i];
    pos = (pos + 1) % ring.length;
  }
  return pos;
}

function readWindow(ring: Float32Array, writeAt: number): Float32Array {
  const window = new Float32Array(TARGET_SAMPLES);
  let start = (writeAt - TARGET_SAMPLES + ring.length) % ring.length;
  for (let i = 0; i < TARGET_SAMPLES; i += 1) {
    window[i] = ring[start];
    start = (start + 1) % ring.length;
  }
  return window;
}

function rms(samples: Float32Array): number {
  if (samples.length === 0) {
    return 0;
  }
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / samples.length);
}

async function ensureMicPermission() {
  const current = await getRecordingPermissionsAsync();
  if (current.granted) {
    return current;
  }
  return requestRecordingPermissionsAsync();
}

export function usePitchDetection(
  strings: GuitarString[],
  a4: number,
  instrument: InstrumentId,
  lockedIndex: number | null,
) {
  const [permission, setPermission] = useState<PermissionState>('undetermined');
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState<TunerReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState(0);

  const stringsRef = useRef(strings);
  const a4Ref = useRef(a4);
  const instrumentRef = useRef(instrument);
  const lockedRef = useRef(lockedIndex);
  const ringRef = useRef(new Float32Array(RING_SIZE));
  const writeAtRef = useRef(0);
  const filledRef = useRef(0);
  const lastVoiceRef = useRef(0);
  const lastYinRef = useRef(0);
  const lastUiRef = useRef(0);
  const pendingRef = useRef<{ reading: TunerReading | null; level: number }>({
    reading: null,
    level: 0,
  });

  stringsRef.current = strings;
  a4Ref.current = a4;
  instrumentRef.current = instrument;
  lockedRef.current = lockedIndex;

  const flushUi = useCallback((now: number, force = false) => {
    if (!force && now - lastUiRef.current < UI_MS) {
      return;
    }
    lastUiRef.current = now;
    setLevel(pendingRef.current.level);
    setReading(pendingRef.current.reading);
  }, []);

  const onBuffer = useCallback(
    (buffer: AudioStreamBuffer) => {
      const samples = toMonoFloat32(buffer);
      const signal = rms(samples);
      pendingRef.current.level = signal;
      const now = Date.now();

      writeAtRef.current = writeRing(ringRef.current, writeAtRef.current, samples);
      filledRef.current = Math.min(RING_SIZE, filledRef.current + samples.length);

      const shouldYin =
        signal >= 0.004 &&
        filledRef.current >= TARGET_SAMPLES &&
        now - lastYinRef.current >= YIN_MS;

      if (shouldYin) {
        lastYinRef.current = now;
        const window = readWindow(ringRef.current, writeAtRef.current);
        const range = RANGES[instrumentRef.current];
        const detected = detectPitch(
          window,
          buffer.sampleRate || 48000,
          range.min,
          range.max,
        );

        if (!detected) {
          if (now - lastVoiceRef.current > SILENCE_MS) {
            pendingRef.current.reading = null;
          }
        } else {
          lastVoiceRef.current = now;
          const chromatic = instrumentRef.current === 'auto';
          const frequency = chromatic
            ? detected.frequency
            : resolveInstrumentFrequency(
                detected.frequency,
                stringsRef.current,
                a4Ref.current,
              );
          const note = nearestNote(frequency, a4Ref.current);
          const stringIndex = chromatic
            ? null
            : (lockedRef.current ??
              closestStringIndex(frequency, stringsRef.current, a4Ref.current));
          const target =
            stringIndex != null
              ? stringFrequency(stringsRef.current[stringIndex], a4Ref.current)
              : undefined;
          const cents = target != null ? centsBetween(frequency, target) : note.cents;

          pendingRef.current.reading = {
            frequency,
            cents,
            noteName: note.name,
            octave: note.octave,
            stringIndex,
            inTune: Math.abs(cents) <= 5,
          };
        }
      } else if (signal < 0.004 && now - lastVoiceRef.current > SILENCE_MS) {
        pendingRef.current.reading = null;
      }

      flushUi(now);
    },
    [flushUi],
  );

  const { stream, isStreaming } = useAudioStream({
    sampleRate: 48000,
    channels: 1,
    encoding: 'int16',
    onBuffer,
  });

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      setError(null);
      try {
        const result = await ensureMicPermission();
        if (cancelled) {
          return;
        }
        setPermission(result.granted ? 'granted' : 'denied');
        if (!result.granted) {
          setError('Mikrofon izni kapalı. Expo Go ayarlarından mikrofonu aç.');
          return;
        }

        writeAtRef.current = 0;
        filledRef.current = 0;
        ringRef.current.fill(0);
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
          interruptionMode: Platform.OS === 'ios' ? 'doNotMix' : 'mixWithOthers',
          shouldPlayInBackground: false,
          shouldRouteThroughEarpiece: false,
        });
        await stream.start();
        if (!cancelled) {
          setListening(true);
        }
      } catch (cause) {
        if (!cancelled) {
          const message = cause instanceof Error ? cause.message : String(cause);
          setListening(false);
          setError(message || 'Mikrofon başlatılamadı.');
        }
      }
    };

    start();
    return () => {
      cancelled = true;
      try {
        stream.stop();
      } catch {
        // already stopped
      }
    };
  }, [stream]);

  return useMemo(
    () => ({
      permission,
      listening: listening || isStreaming,
      reading,
      error,
      level,
    }),
    [permission, listening, isStreaming, reading, error, level],
  );
}
