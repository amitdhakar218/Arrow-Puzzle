package com.arrowpuzzle.tap

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.MobileAds

class MainActivity : AppCompatActivity() {

    private lateinit var adMobManager: AdMobManager

    companion object {
        init {
            System.loadLibrary("arrowpuzzle")
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize Native C++ Game Engine
        initEngine()

        // Initialize Google Mobile Ads (AdMob)
        MobileAds.initialize(this) { initializationStatus ->
            // SDK initialized
        }

        adMobManager = AdMobManager(this)
        adMobManager.loadBanner(findViewById(R.id.adViewContainer))
        adMobManager.loadInterstitial()
    }

    /**
     * Called when a player completes a level in C++ engine.
     * Shows AdMob interstitial ad every 3 levels.
     */
    fun onLevelCompleted(levelNumber: Int) {
        if (levelNumber % 3 == 0) {
            adMobManager.showInterstitial(this)
        }
    }

    /**
     * Called when player clicks "Watch Ad for Free Hints".
     */
    fun onWatchRewardAdClicked() {
        adMobManager.showRewarded(this) { rewardItem ->
            Toast.makeText(this, "Reward earned: +3 Hints!", Toast.LENGTH_SHORT).show()
        }
    }
}
