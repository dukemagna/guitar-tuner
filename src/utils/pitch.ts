import type { GuitarString } from '../data/tunings';
import { centsBetween, stringFrequency } from './notes';

const YIN_THRESHOLD = 0.13;
const downBuf = new Float32Array(2048);
const yinBuf = new Float32Array(1024);

function rms(samples: Float32Array, length: number): number {
  let sum = 0;
  for (let i = 0; i < length; i += 1) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / length);
}

function downsample(input: Float32Array, factor: number): { data: Float32Array; length: number } {
  const length = Math.floor(input.length / factor);
  const data = downBuf;
  for (let i = 0; i < length; i += 1) {
    let sum = 0;
    const base = i * factor;
    for (let k = 0; k < factor; k += 1) {
      sum += input[base + k];
    }
    data[i] = sum / factor;
  }
  return { data, length };
}

function parabolic(yin: Float32Array, tau: number): number {
  if (tau <= 0 || tau >= yin.length - 1) {
    return tau;
  }
  const s0 = yin[tau - 1];
  const s1 = yin[tau];
  const s2 = yin[tau + 1];
  const adjustment = (s2 - s0) / (2 * (2 * s1 - s2 - s0));
  return Number.isFinite(adjustment) ? tau + adjustment : tau;
}

export function detectPitch(
  samples: Float32Array,
  sampleRate: number,
  minFreq = 28,
  maxFreq = 2000,
): { frequency: number; probability: number; rms: number } | null {
  const factor = sampleRate >= 40000 ? 3 : sampleRate >= 22000 ? 2 : 1;
  const { data, length: n } = downsample(samples, factor);
  const rate = sampleRate / factor;
  const level = rms(data, n);
  if (level < 0.004 || n < 64) {
    return null;
  }

  const tauMin = Math.max(2, Math.floor(rate / maxFreq));
  const tauMax = Math.min(n >> 1, Math.floor(rate / minFreq), yinBuf.length - 2);
  if (tauMax <= tauMin + 2) {
    return null;
  }

  const yin = yinBuf;
  for (let tau = 1; tau <= tauMax; tau += 1) {
    let sum = 0;
    const limit = n - tau;
    for (let i = 0; i < limit; i += 1) {
      const delta = data[i] - data[i + tau];
      sum += delta * delta;
    }
    yin[tau] = sum;
  }

  yin[0] = 1;
  let running = 0;
  for (let tau = 1; tau <= tauMax; tau += 1) {
    running += yin[tau];
    yin[tau] = running > 0 ? (yin[tau] * tau) / running : 1;
  }

  let tauEstimate = -1;
  for (let tau = tauMin; tau < tauMax; tau += 1) {
    if (yin[tau] < YIN_THRESHOLD) {
      while (tau + 1 < tauMax && yin[tau + 1] < yin[tau]) {
        tau += 1;
      }
      tauEstimate = tau;
      break;
    }
  }

  if (tauEstimate < 0) {
    let minVal = 1;
    for (let tau = tauMin; tau < tauMax; tau += 1) {
      if (yin[tau] < minVal) {
        minVal = yin[tau];
        tauEstimate = tau;
      }
    }
    if (minVal > 0.28) {
      return null;
    }
  }

  const frequency = rate / parabolic(yin, tauEstimate);
  if (!Number.isFinite(frequency) || frequency < minFreq || frequency > maxFreq) {
    return null;
  }

  return {
    frequency,
    probability: Math.max(0, 1 - yin[tauEstimate]),
    rms: level,
  };
}

export function resolveInstrumentFrequency(
  frequency: number,
  strings: GuitarString[],
  a4: number,
): number {
  const factors = [1, 0.5, 2];
  let best = frequency;
  let bestCents = Infinity;

  for (const factor of factors) {
    const candidate = frequency * factor;
    for (const string of strings) {
      const cents = Math.abs(centsBetween(candidate, stringFrequency(string, a4)));
      if (cents < bestCents) {
        bestCents = cents;
        best = candidate;
      }
    }
  }

  return bestCents < 90 ? best : frequency;
}
