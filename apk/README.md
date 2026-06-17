# Moonbug APK Build Instructions

## Prerequisites
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK) 11+

## Building the APK

1. **Build the web app**:
```bash
npm run build
```

2. **Sync with Capacitor**:
```bash
npx cap sync android
```

3. **Open in Android Studio**:
```bash
npx cap open android
```

4. **Build APK in Android Studio**:
   - In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
   - The APK will be generated in `android/app/build/outputs/apk/debug/`

## Estimated APK Size
- **25-40MB** (with offline models for speech-to-text)
- **15-20MB** (using web APIs only)

## Features Included
- Offline-first storage (IndexedDB)
- School-based authentication
- Survey system with SAT rewards
- Moon Dial (lunar tracking)
- Quick Input (text/voice)
- Accessibility support
- Privacy controls

## Notes
- The app requires internet for initial Firebase sync
- Offline mode works for notes, scopes, and surveys
- Voice input requires browser Web Speech API support