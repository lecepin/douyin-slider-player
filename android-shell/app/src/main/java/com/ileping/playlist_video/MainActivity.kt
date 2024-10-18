package com.ileping.playlist_video

import android.app.Activity
import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.LinearLayout
import android.widget.Toast
import androidx.activity.result.ActivityResult
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts

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
            webChromeClient = WebChromeClient()

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