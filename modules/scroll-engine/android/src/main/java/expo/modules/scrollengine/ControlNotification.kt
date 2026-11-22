package expo.modules.scrollengine

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

object ControlNotification {
  const val ACTION_TOGGLE = "expo.modules.scrollengine.TOGGLE"
  const val ACTION_SLOWER = "expo.modules.scrollengine.SLOWER"
  const val ACTION_FASTER = "expo.modules.scrollengine.FASTER"

  private const val CHANNEL = "scrollino_controls"
  private const val ID = 4107

  fun show(context: Context, running: Boolean, secs: Int) {
    val manager = NotificationManagerCompat.from(context)
    if (!manager.areNotificationsEnabled()) return
    ensureChannel(context)

    val title = if (running) {
      EnginePrefs.label(context, "notifScrolling", "Scrolling, one screen every {n} s").replace("{n}", secs.toString())
    } else {
      EnginePrefs.label(context, "notifPaused", "Paused")
    }
    val toggleLabel = if (running) {
      EnginePrefs.label(context, "actionPause", "Pause")
    } else {
      EnginePrefs.label(context, "actionStart", "Start")
    }

    val notification = NotificationCompat.Builder(context, CHANNEL)
      .setSmallIcon(R.drawable.scrollino_notification)
      .setContentTitle(title)
      .setOngoing(true)
      .setSilent(true)
      .setOnlyAlertOnce(true)
      .setShowWhen(false)
      .setCategory(NotificationCompat.CATEGORY_SERVICE)
      .setPriority(NotificationCompat.PRIORITY_LOW)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setContentIntent(openApp(context))
      .addAction(0, EnginePrefs.label(context, "actionSlower", "Slower"), broadcast(context, ACTION_SLOWER, 1))
      .addAction(0, toggleLabel, broadcast(context, ACTION_TOGGLE, 2))
      .addAction(0, EnginePrefs.label(context, "actionFaster", "Faster"), broadcast(context, ACTION_FASTER, 3))
      .build()

    runCatching { manager.notify(ID, notification) }
  }

  fun cancel(context: Context) = NotificationManagerCompat.from(context).cancel(ID)

  private fun ensureChannel(context: Context) {
    val manager = context.getSystemService(NotificationManager::class.java)
    val name = EnginePrefs.label(context, "controlsChannel", "Scroll controls")
    manager.createNotificationChannel(
      NotificationChannel(CHANNEL, name, NotificationManager.IMPORTANCE_LOW).apply {
        setShowBadge(false)
      },
    )
  }

  private fun broadcast(context: Context, action: String, code: Int) = PendingIntent.getBroadcast(
    context,
    code,
    Intent(action).setPackage(context.packageName),
    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
  )

  private fun openApp(context: Context) = PendingIntent.getActivity(
    context,
    0,
    context.packageManager.getLaunchIntentForPackage(context.packageName),
    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
  )
}
