import { expect, it } from 'bun:test'

import {
  clampSecs,
  DEFAULT_SECS,
  MAX_SECS,
  MIN_SECS,
  PRESETS,
  progressToSecs,
  screensPerMinute,
  secsToProgress,
} from './speed'

it('mapeia as pontas do slider', () => {
  expect(progressToSecs(0)).toBe(MIN_SECS)
  expect(progressToSecs(1)).toBe(MAX_SECS)
  expect(MIN_SECS).toBe(3)
  expect(MAX_SECS).toBe(60)
})

it('ida e volta preserva cada segundo', () => {
  for (let secs = MIN_SECS; secs <= MAX_SECS; secs++) {
    expect(progressToSecs(secsToProgress(secs))).toBe(secs)
  }
})

it('dá mais curso aos valores lentos de leitura', () => {
  expect(secsToProgress(15)).toBeGreaterThan(0.5)
})

it('limita valores fora do intervalo', () => {
  expect(clampSecs(100)).toBe(60)
  expect(clampSecs(0)).toBe(3)
  expect(clampSecs(Number.NaN)).toBe(DEFAULT_SECS)
  expect(clampSecs(12.6)).toBe(13)
})

it('converte em telas por minuto', () => {
  expect(screensPerMinute(15)).toBe(4)
  expect(screensPerMinute(60)).toBe(1)
})

it('atalhos lento, padrão e rápido', () => {
  expect(PRESETS.map(({ secs }) => secs)).toEqual([20, 15, 10])
  expect(DEFAULT_SECS).toBe(15)
})
