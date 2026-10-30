package com.arrowpuzzle.tap

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.MobileAds

class MainActivity : AppCompatActivity() {

    internal lateinit var adMobManager: AdMobManager
    private lateinit var gameWebView: WebView

    companion object {
        init {
            try {
                System.loadLibrary("arrowpuzzle")
            } catch (e: UnsatisfiedLinkError) {
                e.printStackTrace()
            }
        }
    }

    // Native C++ NDK Engine Declarations
    external fun initEngine()
    external fun loadLevel(levelNum: Int)
    external fun tapTile(tileId: Int): String
    external fun undoMove(): Boolean
    external fun getHint(): Int
    external fun isLevelCompleted(): Boolean
    external fun getLevelStatusJson(): String

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // 1. Initialize C++ Native Engine
        try {
            initEngine()
        } catch (e: Exception) {
            e.printStackTrace()
        }

        // 2. Initialize Google Mobile Ads (AdMob)
        MobileAds.initialize(this) { _ -> }

        val bannerContainer = findViewById<FrameLayout>(R.id.adViewContainer)
        adMobManager = AdMobManager(this)
        adMobManager.loadBanner(bannerContainer)
        adMobManager.loadInterstitial()

        // 3. Initialize Game View (Instant, 60fps offline gameplay)
        gameWebView = findViewById(R.id.gameWebView)
        gameWebView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            setSupportZoom(false)
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        // Add Bridge so game can trigger native AdMob
        gameWebView.addJavascriptInterface(AndroidNativeBridge(this), "AndroidNative")

        gameWebView.webViewClient = WebViewClient()
        gameWebView.webChromeClient = WebChromeClient()

        // Load 100 levels Arrow Puzzle directly from internal assets
        gameWebView.loadUrl("file:///android_asset/www/index.html")
    }

    inner class AndroidNativeBridge(private val activity: MainActivity) {
        @JavascriptInterface
        fun showInterstitialAd(levelNum: Int) {
            activity.runOnUiThread {
                activity.adMobManager.showInterstitial(activity)
            }
        }

        @JavascriptInterface
        fun showRewardedAd() {
            activity.runOnUiThread {
                activity.adMobManager.showRewarded(activity) {
                    Toast.makeText(activity, "Reward Earned: +3 Hints!", Toast.LENGTH_SHORT).show()
                    activity.gameWebView.evaluateJavascript("window.onNativeRewardGranted && window.onNativeRewardGranted();", null)
                }
            }
        }

        @JavascriptInterface
        fun isNative(): Boolean {
            return true
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (gameWebView.canGoBack()) {
            gameWebView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
