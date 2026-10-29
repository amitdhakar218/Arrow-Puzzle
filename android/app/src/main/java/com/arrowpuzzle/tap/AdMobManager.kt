package com.arrowpuzzle.tap

import android.app.Activity
import android.content.Context
import android.view.ViewGroup
import com.google.android.gms.ads.*
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardItem
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class AdMobManager(private val context: Context) {

    private var interstitialAd: InterstitialAd? = null
    private var rewardedAd: RewardedAd? = null

    fun loadBanner(container: ViewGroup) {
        val adView = AdView(context)
        adView.setAdSize(AdSize.BANNER)
        adView.adUnitId = context.getString(R.string.admob_banner_id)
        container.addView(adView)

        val adRequest = AdRequest.Builder().build()
        adView.loadAd(adRequest)
    }

    fun loadInterstitial() {
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(
            context,
            context.getString(R.string.admob_interstitial_id),
            adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialAd = ad
                }
                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    interstitialAd = null
                }
            }
        )
    }

    fun showInterstitial(activity: Activity) {
        if (interstitialAd != null) {
            interstitialAd?.show(activity)
            loadInterstitial() // Preload next
        }
    }

    fun showRewarded(activity: Activity, onRewardEarned: (RewardItem) -> Unit) {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(
            context,
            context.getString(R.string.admob_rewarded_id),
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    rewardedAd = ad
                    ad.show(activity) { rewardItem ->
                        onRewardEarned(rewardItem)
                    }
                }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    rewardedAd = null
                }
            }
        )
    }
}
