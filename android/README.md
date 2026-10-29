# Arrow Puzzle: Tap - C++ Android Game & CI/CD APK Build

यह **Arrow Puzzle: Tap** मोबाइल गेम का कंप्लीट C++ NDK + Android Studio प्रोजेक्ट है, जिसमें **100 प्रोग्रेसिव लेवल्स**, **GitHub Actions CI/CD ऑटोमेटेड APK बिल्ड**, और **Google AdMob ऐड्स** प्री-कन्फिगर हैं।

---

## 🚀 फीचर्स (Features)

1. **C++20 NDK Game Engine (`/android/app/src/main/cpp/`)**:
   - हाई-परफॉरमेंस 60 FPS एरो कोलिशन व पाथ फाइंडर एल्गोरिथम
   - 100 100% सॉल्वेबल लेवल्स (रिवर्स असेंबली प्रूवेन)
   - रोटेटर एरो (घड़ी की दिशा में 90° घूमना), डबल एरो, लॉक्ड एरो और ऑब्स्टेकल्स
   - जेएनआई (JNI) ब्रिज के ज़रिए सीधे जावा/कोटलिन से कनेक्टेड

2. **Google AdMob इंटीग्रेशन**:
   - बॉटम बैनर ऐड (Banner Ad)
   - हर 3 लेवल पूरे होने पर फुलस्क्रीन इंटरस्टीशियल ऐड (Interstitial Ad)
   - फ्री हिंट्स और अनडू के लिए रिवार्डेड वीडियो ऐड (Rewarded Ad)
   - `admob_config.json` और `res/values/strings.xml` में बस अपनी AdMob IDs डालें!

3. **GitHub Actions ऑटोमेटेड APK बिल्डर (`.github/workflows/build-apk.yml`)**:
   - जब भी आप गिटहब पर कोड पुश करेंगे या "Run workflow" पर क्लिक करेंगे, गिटहब ऑटोमैटिकली NDK व C++ कंपाइल करके आपके लिए **`app-debug.apk`** और **`app-release.apk`** तैयार कर देगा!
   - आप Actions टैब के **Artifacts** से 1 क्लिक में डाउनलोड कर सकते हैं।

---

## 🛠️ AdMob अकाउंट कैसे जोड़ें (How to Add Your AdMob Account)

1. [Google AdMob Console](https://admob.google.com/) पर जाएं और अपनी नई ऐप रजिस्टर करें।
2. वहां से अपनी:
   - **App ID** (जैसे: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`)
   - **Banner Ad Unit ID** (जैसे: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`)
   - **Interstitial Ad Unit ID**
   - **Rewarded Ad Unit ID**
3. इन दोनों फाइलों में टेस्ट IDs की जगह अपनी असली IDs पेस्ट कर दें:
   - `android/admob_config.json`
   - `android/app/src/main/res/values/strings.xml`
4. गिटहब पर कमिट/पुश करें। आपकी नई APK में आपकी असली एड्स दिखने लगेंगी और आपकी अर्निंग शुरू हो जाएगी!

---

## 📦 GitHub Actions से APK कैसे बनाएं और डाउनलोड करें

1. इस पूरे प्रोजेक्ट को अपने GitHub अकाउंट में एक नए रिपॉजिटरी में पुश करें:
   ```bash
   git init
   git add .
   git commit -m "Arrow Puzzle: Tap 100 Levels with C++ Engine and AdMob"
   git remote add origin https://github.com/<your-username>/arrow-puzzle-tap.git
   git branch -M main
   git push -u origin main
   ```
2. GitHub पर अपने रिपोजिटरी के **"Actions"** टैब पर जाएं।
3. वहां **"Build Android APK (C++ & AdMob)"** वर्कफ़्लो अपने आप चलना शुरू हो जाएगा।
4. 2-3 मिनट में जब ग्रीन टिक लग जाए, तो उस रन पर क्लिक करें।
5. नीचे **Artifacts** सेक्शन में आपको:
   - 📲 **ArrowPuzzle-Debug-APK** (तुरंत फोन में इनस्टॉल करके टेस्ट करने के लिए)
   - 📲 **ArrowPuzzle-Release-APK**
   मिल जाएंगे। डाउनलोड करें और अपने मोबाइल में इनस्टॉल करें!

---

## 💻 लोकल डेवलपमेंट (Local Android Studio Build)

1. Android Studio खोलें और `Open Project` चुनकर `/android` फोल्डर सेलेक्ट करें।
2. NDK (v26+) और CMake (v3.22+) अपने आप डिटेक्ट हो जाएंगे।
3. `Run` बटन (Shift+F10) दबाएं या `./gradlew assembleDebug` रन करें।
