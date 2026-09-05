import {
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioStream,
  type AudioStreamBuffer,
} from 'expo-audio';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { GuitarString, NoteName } from '../data/tunings';
import {
  centsBetween,
  closestStringIndex,
  nearestNote,
  stringFrequency,
} from '../utils/notes';
import { detectPitch, resolveGuitarFrequency } from '../utils/pitch';

const TARGET_SAMPLES = 4096;
const RING_SIZE = TARGET_SAMPLES * 2;
const SILENCE_MS = 280;

export type TunerMode = 'auto' | 'manual';

export type TunerReading = {
  frequency: number;
  cents: number;
  noteName: NoteName;
  octave: number;
  stringIndex: number;
  inTune: boolean;
};

function toMonoFloat32(buffer: AudioStreamBuffer): Float32Array {
  const channels = Math.max(1, buffer.channels ?? 1);
  const floats = new Float32Array(buffer.data.slice(0));
  return channels === 1 ? floats : downmix(floats, channels);
}

function downmix(samples: Float32Array, channels: number): Float32Array {
  const frames = Math.floor(samples.length / channels);
  const mono = new Float32Array(frames);
  for (let i = 0; i < frames; i += 1) {
    let sum = 0;
    for (let c = 0; c < channels; c += 1) {
      sum += samples[i * channels + c];
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

export function usePitchDetection(
  strings: GuitarString[],
  a4: number,
  mode: TunerMode,
  manualIndex: number,
) {
  const [permission, setPermission] = useState<'undetermined' | 'granted' | 'denied'>(
    'undetermined',
  );
  const [listening, setListening] = useState(false);
  const [reading, setReading] = useState<TunerReading | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stringsRef = useRef(strings);
  const a4Ref = useRef(a4);
  const modeRef = useRef(mode);
  const manualRef = useRef(manualIndex);
  const ringRef = useRef(new Float32Array(RING_SIZE));
  const writeAtRef = useRef(0);
  const filledRef = useRef(0);
  const lastVoiceRef = useRef(0);
  const lastEmitRef = useRef(0);

  stringsRef.current = strings;
  a4Ref.current = a4;
  modeRef.current = mode;
  manualRef.current = manualIndex;

  const onBuffer = useCallback((buffer: AudioStreamBuffer) => {
    const samples = toMonoFloat32(buffer);
    writeAtRef.current = writeRing(ringRef.current, writeAtRef.current, samples);
    filledRef.current = Math.min(RING_SIZE, filledRef.current + samples.length);
    if (filledRef.current < TARGET_SAMPLES) {
      return;
    }

    const window = readWindow(ringRef.current, writeAtRef.current);
    const sampleRate = buffer.sampleRate || 44100;
    const detected = detectPitch(window, sampleRate);
    const now = Date.now();

    if (!detected) {
      if (now - lastVoiceRef.current > SILENCE_MS) {
        setReading(null);
      }
      return;
    }

    lastVoiceRef.current = now;
    if (now - lastEmitRef.current < 50) {
      return;
    }
    lastEmitRef.current = now;

    const frequency = resolveGuitarFrequency(
      detected.frequency,
      stringsRef.current,
      a4Ref.current,
    );
    const stringIndex =
      modeRef.current === 'manual'
        ? manualRef.current
        : closestStringIndex(frequency, stringsRef.current, a4Ref.current);
    const target = stringFrequency(stringsRef.current[stringIndex], a4Ref.current);
    const note = nearestNote(frequency, a4Ref.current);
    const cents = centsBetween(frequency, target);

    setReading({
      frequency,
      cents,
      noteName: note.name,
      octave: note.octave,
      stringIndex,
      inTune: Math.abs(cents) <= 5,
    });
  }, []);

  const { stream, isStreaming } = useAudioStream({
    sampleRate: 44100,
    channels: 1,
    encoding: 'float32',
    onBuffer,
  });

  useEffect(() => {
    let active = true;
    requestRecordingPermissionsAsync().then((result) => {
      if (!active) {
        return;
      }
      setPermission(result.granted ? 'granted' : 'denied');
    });
    return () => {
      active = false;
    };
  }, []);

  const start = useCallback(async () => {
    const result = await requestRecordingPermissionsAsync();
    setPermission(result.granted ? 'granted' : 'denied');
    if (!result.granted) {
      return;
    }
    writeAtRef.current = 0;
    filledRef.current = 0;
    ringRef.current.fill(0);
    setError(null);
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
        interruptionMode: 'doNotMix',
        shouldPlayInBackground: false,
        shouldRouteThroughEarpiece: false,
      });
      await stream.start();
      setListening(true);
    } catch {
      setError('Mikrofon başlatılamadı. Expo Go veya development build ile tekrar dene.');
    }
  }, [stream]);

  const stop = useCallback(() => {
    stream.stop();
    setListening(false);
    setReading(null);
    setAudioModeAsync({
      allowsRecording: false,
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    }).catch(() => undefined);
  }, [stream]);

  return useMemo(
    () => ({
      permission,
      listening: listening || isStreaming,
      reading,
      error,
      start,
      stop,
    }),
    [permission, listening, isStreaming, reading, error, start, stop],
  );
}
