import type { SharePayload } from '../types/game';

type PackedShare = {
  m: string;
  d: string;
  s: string;
  r: number[];
  t: number;
};

function base64UrlEncode(input: string): string {
  return btoa(input).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = `${normalized}${'='.repeat((4 - (normalized.length % 4)) % 4)}`;
  return atob(padded);
}

export function encodeSharePayload(payload: SharePayload): string {
  const packed: PackedShare = {
    m: payload.mode,
    d: payload.difficulty,
    s: payload.seed,
    r: payload.roundScores,
    t: payload.totalScore,
  };

  return base64UrlEncode(JSON.stringify(packed));
}

export function decodeSharePayload(code: string): SharePayload | null {
  try {
    const decoded = JSON.parse(base64UrlDecode(code)) as PackedShare;
    if (!decoded || !Array.isArray(decoded.r)) {
      return null;
    }

    return {
      mode: decoded.m as SharePayload['mode'],
      difficulty: decoded.d as SharePayload['difficulty'],
      seed: decoded.s,
      roundScores: decoded.r,
      totalScore: decoded.t,
    };
  } catch {
    return null;
  }
}
