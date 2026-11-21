package expo.modules.scrollengine

import kotlin.math.roundToInt

data class Chunk(val durationMs: Long, val startY: Float, val endY: Float)

object ScrollMath {
  const val MIN_SECS = 3
  const val MAX_SECS = 60
  const val DEFAULT_SECS = 15
  const val RETRY_YIELD_THRESHOLD = 6

  private const val CHUNK_SPAN = 0.25f
  private const val CHUNK_MIN_MS = 1500
  private const val CHUNK_MAX_MS = 6000
  private const val CHUNK_HARD_MAX_MS = 10000
  private const val CHUNK_FLOOR_MS = 400
  private const val MAX_SPAN = 0.70f
  private const val MIN_SPAN = 0.002f
  private const val START_RATIO = 0.80f
  private const val MIN_Y_RATIO = 0.10f
  private const val MIN_TRAVEL_DP = 32f
  private val RETRY_STEPS = intArrayOf(16, 32, 64, 128, 256, 512)

  fun clampSecs(secs: Int) = secs.coerceIn(MIN_SECS, MAX_SECS)

  fun retryDelayMs(attempt: Int) = RETRY_STEPS[attempt.coerceIn(0, RETRY_STEPS.lastIndex)]

  fun compute(secs: Int, screenHeight: Int, density: Float): Chunk {
    val seconds = clampSecs(secs)
    val height = screenHeight.coerceAtLeast(1)
    val totalMs = seconds * 1000f

    var durationMs = (totalMs * CHUNK_SPAN).roundToInt().coerceIn(CHUNK_MIN_MS, CHUNK_MAX_MS)
    var span = durationMs / totalMs
    if (span > MAX_SPAN) {
      span = MAX_SPAN
      durationMs = (MAX_SPAN * totalMs).roundToInt()
    }
    durationMs = durationMs.coerceAtLeast(CHUNK_FLOOR_MS)
    span = span.coerceAtLeast(MIN_SPAN)

    val minPx = MIN_TRAVEL_DP * density.coerceAtLeast(1f)
    if (height * span < minPx) {
      span = minPx / height
      durationMs = (span * totalMs).roundToInt().coerceAtMost(CHUNK_HARD_MAX_MS)
    }

    var startY = height * START_RATIO
    var endY = startY - height * span
    val minY = height * MIN_Y_RATIO
    if (endY < minY) {
      startY = minY + height * span
      endY = minY
    }
    return Chunk(durationMs.toLong(), startY, endY)
  }
}
