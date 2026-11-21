export const MIN_SECS = 3
export const MAX_SECS = 60
export const DEFAULT_SECS = 15

export const PRESETS = [
  { key: 'slow', secs: 20 },
  { key: 'standard', secs: 15 },
  { key: 'fast', secs: 10 },
] as const

const SPAN = Math.log(MAX_SECS / MIN_SECS)

export function clampSecs(secs: number) {
  if (!Number.isFinite(secs)) return DEFAULT_SECS
  return Math.min(MAX_SECS, Math.max(MIN_SECS, Math.round(secs)))
}

export function progressToSecs(progress: number) {
  return clampSecs(MIN_SECS * Math.exp(Math.min(1, Math.max(0, progress)) * SPAN))
}

export function secsToProgress(secs: number) {
  return Math.log(clampSecs(secs) / MIN_SECS) / SPAN
}

export function screensPerMinute(secs: number) {
  return Math.round((60 / clampSecs(secs)) * 10) / 10
}
