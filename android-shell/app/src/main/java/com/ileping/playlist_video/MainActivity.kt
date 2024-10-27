package com.ileping.playlist_video

import android.app.Activity
import android.content.Intent
import android.content.pm.ActivityInfo
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.JsPromptResult
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var _exitTime = 0L
    private lateinit var splashLauncher: ActivityResultLauncher<Intent>
    private val tag = this::class.simpleName
    private var isFromSplash = false
    private var isInBackground = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        splashLauncher =
            registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult ->
                if (result.resultCode == Activity.RESULT_OK) {
                    isFromSplash = true
                    Log.d(tag, "Returned from SplashActivity")
                }
            }

        webView = WebView(this).apply {
            settings.apply {
                domStorageEnabled = true
                javaScriptEnabled = true
                blockNetworkImage = false
                allowUniversalAccessFromFileURLs = true
            }
            webViewClient = WebViewClient()
            webChromeClient = object : WebChromeClient() {
                override fun onJsPrompt(
                    view: WebView?,
                    url: String?,
                    message: String?,
                    defaultValue: String?,
                    result: JsPromptResult?
                ): Boolean {
                    val uri = Uri.parse(message)
                    if (url != null && message != null) {
                        if (message.startsWith("native://")) {

                            when (uri.host) {
                                "getO" -> {
                                    result?.confirm(resources.configuration.orientation.toString())
                                }

                                "setOV" -> {
                                    result?.cancel()
                                    requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
                                }

                                "setOH" -> {
                                    result?.cancel()
                                    requestedOrientation =
                                        ActivityInfo.SCREEN_ORIENTATION_SENSOR_LANDSCAPE
                                }

                                "setFull" -> {
                                    result?.cancel()
                                    window.setFlags(
                                        WindowManager.LayoutParams.FLAG_FULLSCREEN,
                                        WindowManager.LayoutParams.FLAG_FULLSCREEN
                                    )
                                }

                                "getVer" -> {
                                    result?.confirm(
                                        packageManager.getPackageInfo(
                                            context.packageName,
                                            0
                                        ).versionName
                                    )
                                }
                            }
                            return true
                        }
                    }
                    return super.onJsPrompt(view, url, message, defaultValue, result)
                }
            }


            loadUrl("file:///android_asset/index.html")
        }

        findViewById<LinearLayout>(R.id.main_container).addView(
            webView,
            LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )
    }

    override fun onBackPressed() {
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
        window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)


        if (webView.canGoBack()) {
            webView.goBack()
        } else if (System.currentTimeMillis() - _exitTime > 2000) {
            Toast.makeText(this, "再按一次退出", Toast.LENGTH_SHORT).show();
            _exitTime = System.currentTimeMillis()
        } else {
            finish();
        }
    }


    override fun onResume() {
        super.onResume()
    }

    override fun onPause() {
        super.onPause()
        isInBackground = true
        isFromSplash = false
    }
}