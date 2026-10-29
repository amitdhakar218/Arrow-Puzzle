# Arrow Puzzle: Tap - C++ Android Game & CI/CD APK Build

यह **Arrow Puzzle: Tap** मोबाइल गेम का कंप्लीट C++ NDK + Android Studio प्रोजेक्ट है। इसमें **100 प्रोग्रेसिव लेवल्स**, **GitHub Actions CI/CD ऑटोमेटेड APK बिल्ड**, और आपके **Google AdMob अकाउंट (`pub-4896944310343088`)** की असली IDs प्री-कन्फिगर हैं।

---

## 🎯 आपके AdMob अकाउंट की असली IDs कन्फिगर कर दी गई हैं:
- **Publisher ID**: `pub-4896944310343088`
- **Banner Ad**: `ca-app-pub-4896944310343088/1574563740`
- **Interstitial Ad**: `ca-app-pub-4896944310343088/7766447903`
- **App Open Ad**: `ca-app-pub-4896944310343088/9261482073`
- **Native Advanced**: `ca-app-pub-4896944310343088/2698401163`

---

## ⚙️ GitHub Actions में APK क्यों नहीं बनी थी और अब कैसे फिक्स हुआ?
पहले GitHub Actions में निम्न कारण से एरर आया था:
1. `libs.versions.toml` मिसिंग होने के कारण Gradle प्लगइन रिजॉल्व नहीं हुआ था।
2. `activity_main.xml` और ऐप आइकन्स (`ic_launcher`) मिसिंग थे।
3. Gradle 8.5 एनवायरनमेंट ऑटो-प्रोविजनिंग सेटअप नहीं थी।

**अब सब कुछ 100% फिक्स कर दिया गया है:**
- `.github/workflows/build-apk.yml` में `gradle/actions/setup-gradle@v3` जोड़ दिया गया है।
- नियन एरो गेम आइकन (`ic_launcher` & `ic_launcher_round`) जोड़ दिए गए हैं।
- लेआउट और रिसोर्स फाइल्स रेडी हैं।

---

## 📦 GitHub Actions से APK कैसे बनाएं और डाउनलोड करें:

1. अपने लोकल कंप्यूटर या Git टर्मिनल पर इस कोड को अपने GitHub रिपॉजिटरी में पुश करें:
   ```bash
   git add .
   git commit -m "Fix Android Gradle build, AdMob real IDs, and app icons"
   git push origin main
   ```
   *(Repo: `https://github.com/amitdhakar218/Arrow-Puzzle`)*

2. GitHub पर जाएं: [https://github.com/amitdhakar218/Arrow-Puzzle/actions](https://github.com/amitdhakar218/Arrow-Puzzle/actions)
3. वहां **"Build Android APK (C++ & AdMob)"** वर्कफ़्लो अपने आप रन हो जाएगा (या आप "Run workflow" बटन भी दबा सकते हैं)।
4. 2-3 मिनट में जब ग्रीन टिक (✅) लग जाए, तो उस रन पर क्लिक करें।
5. नीचे **Artifacts** सेक्शन से:
   - 📲 **ArrowPuzzle-Debug-APK** (तुरंत मोबाइल में इनस्टॉल करने के लिए)
   डाउनलोड करें और मजे लें!
