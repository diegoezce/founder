import { useRef, useCallback } from 'react';

function createClickBuffer(ctx) {
  const buffer   = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
  const data     = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t    = i / ctx.sampleRate;
    const env  = Math.exp(-t * 120);
    data[i]    = (Math.random() * 2 - 1) * env * 0.4;
  }
  return buffer;
}

function createBeepBuffer(ctx, freq = 880, duration = 0.08) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data   = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    const t   = i / ctx.sampleRate;
    const env = t < 0.01 ? t / 0.01 : Math.exp(-(t - 0.01) * 20);
    data[i]   = Math.sin(2 * Math.PI * freq * t) * env * 0.15;
  }
  return buffer;
}

export function useSound(enabled) {
  const ctxRef     = useRef(null);
  const clickBufRef= useRef(null);
  const beepBufRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current    = new (window.AudioContext || window.webkitAudioContext)();
      clickBufRef.current = createClickBuffer(ctxRef.current);
      beepBufRef.current  = createBeepBuffer(ctxRef.current);
    }
    return ctxRef.current;
  }, []);

  const playClick = useCallback(() => {
    if (!enabled) return;
    try {
      const ctx  = getCtx();
      const src  = ctx.createBufferSource();
      src.buffer = clickBufRef.current;
      src.connect(ctx.destination);
      src.start();
    } catch {}
  }, [enabled, getCtx]);

  const playBeep = useCallback((freq = 660) => {
    if (!enabled) return;
    try {
      const ctx    = getCtx();
      const buffer = createBeepBuffer(ctx, freq);
      const src    = ctx.createBufferSource();
      src.buffer   = buffer;
      src.connect(ctx.destination);
      src.start();
    } catch {}
  }, [enabled, getCtx]);

  const playSelect = useCallback(() => playBeep(880), [playBeep]);
  const playConfirm = useCallback(() => playBeep(1100), [playBeep]);
  const playError   = useCallback(() => playBeep(220),  [playBeep]);

  return { playClick, playSelect, playConfirm, playError };
}
