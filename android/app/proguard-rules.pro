# Proguard rules for Arrow Puzzle
-keep class com.arrowpuzzle.tap.** { *; }
-keepclassmembers class * {
    native <methods>;
}
-keep public class com.google.android.gms.ads.** { *; }
-dontwarn com.google.android.gms.ads.**
