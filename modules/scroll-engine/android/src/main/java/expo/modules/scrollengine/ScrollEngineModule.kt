package expo.modules.scrollengine

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.provider.Settings
import android.util.Base64
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream

class ScrollEngineModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

  private var engine: EngineState? = null

  private fun state() = engine ?: EngineState(context) { sendEvent("onStateChange", it) }.also {
    it.start()
    engine = it
  }

  override fun definition() = ModuleDefinition {
    Name("ScrollEngine")

    Events("onStateChange")

    OnDestroy {
      engine?.stop()
      engine = null
    }

    OnActivityEntersForeground {
      state().request { sendEvent("onStateChange", it) }
    }

    Function("getState") { state().snapshot() }

    AsyncFunction("requestState") { promise: Promise -> state().request { promise.resolve(it) } }

    Function("openAccessibilitySettings") {
      context.startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }

    Function("openNotificationSettings") {
      context.startActivity(
        Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS)
          .putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
          .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
      )
    }

    Function("setSecondsPerScreen") { secs: Int -> state().setSecs(secs) }

    Function("setAllowedPackages") { packages: List<String> ->
      EngineIntents.send(context, EngineIntents.SET_ALLOWED) {
        putExtra(EngineIntents.VALUE, packages.toTypedArray())
      }
    }

    Function("setLabels") { labels: Map<String, String> ->
      EngineIntents.send(context, EngineIntents.SET_LABELS) {
        putExtra(EngineIntents.KEYS, labels.keys.toTypedArray())
        putExtra(EngineIntents.VALUES, labels.values.toTypedArray())
      }
    }

    Function("refreshControls") { EngineIntents.send(context, EngineIntents.REFRESH) }

    AsyncFunction("listLaunchableApps") { listLaunchableApps() }
  }

  private fun listLaunchableApps(): List<Map<String, String>> {
    val manager = context.packageManager
    val launcher = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
    return manager.queryIntentActivities(launcher, PackageManager.MATCH_ALL)
      .map { it.activityInfo.applicationInfo }
      .filter { it.packageName != context.packageName }
      .distinctBy { it.packageName }
      .map { info ->
        mapOf(
          "packageName" to info.packageName,
          "label" to manager.getApplicationLabel(info).toString(),
          "icon" to iconDataUri(manager.getApplicationIcon(info)),
        )
      }
      .sortedBy { it["label"]?.lowercase() }
  }

  private fun iconDataUri(drawable: Drawable): String {
    val px = (40 * context.resources.displayMetrics.density).toInt()
    val bitmap = Bitmap.createBitmap(px, px, Bitmap.Config.ARGB_8888)
    drawable.setBounds(0, 0, px, px)
    drawable.draw(Canvas(bitmap))
    val bytes = ByteArrayOutputStream().also { bitmap.compress(Bitmap.CompressFormat.PNG, 100, it) }
    bitmap.recycle()
    return "data:image/png;base64," + Base64.encodeToString(bytes.toByteArray(), Base64.NO_WRAP)
  }
}
