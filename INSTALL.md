# Installation Instructions

Complete guide to install and run the Mobile Device Management System.

---

## 🚀 Method 1: Quick Start (Instant - No Installation)

### Option A: Use GitHub Pages (Recommended)
Visit the live demo:
```
https://YOUR_USERNAME.github.io/mobile-mdm-system/
```
**No installation needed!** Just open and use.

### Option B: Download and Open
```bash
# Download ZIP from GitHub
# Extract files
# Open index.html in your browser
```

---

## 💻 Method 2: Git Clone (For Developers)

### Prerequisites:
- Git installed
- Modern web browser

### Steps:

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git

# 2. Navigate to folder
cd mobile-mdm-system

# 3. Open in browser
# Simply open index.html in your browser
# OR use a local server (see below)
```

### Run with Local Server:

**Using Python:**
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

**Using Node.js:**
```bash
npx http-server
# Visit http://localhost:8080
```

**Using PHP:**
```bash
php -S localhost:8000
# Visit http://localhost:8000
```

**Using npm (if you have package.json):**
```bash
npm install
npm start
# Visit http://localhost:8000
```

---

## 📱 Method 3: Install as Android App

### Prerequisites:
- Node.js 14+ ([Download](https://nodejs.org/))
- Android SDK ([Download](https://developer.android.com/studio))
- Java JDK 8+ ([Download](https://www.oracle.com/java/technologies/downloads/))
- Git

### Step-by-Step:

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git
cd mobile-mdm-system

# 2. Install Cordova globally
npm install -g cordova

# 3. Navigate to cordova folder
cd cordova

# 4. Run automated setup script
bash setup-android-app.sh
```

The script will:
- Create Cordova project
- Add Android platform
- Install necessary plugins
- Configure permissions
- Guide you through the build process

### Manual Android Setup (Alternative):

```bash
# 1. Install Cordova
npm install -g cordova

# 2. Create Cordova project
cordova create MDMApp com.yourcompany.mdm "MDM System"
cd MDMApp

# 3. Add Android platform
cordova platform add android

# 4. Copy web files to www/
cp -r ../index.html www/
cp -r ../css www/
cp -r ../js www/

# 5. Copy configuration
cp ../cordova/config.xml .
cp ../cordova/cordova-integration.js www/js/

# 6. Add plugins
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-geolocation
cordova plugin add cordova-plugin-network-information
cordova plugin add cordova-plugin-battery-status
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-dialogs

# 7. Build APK
cordova build android

# 8. Run on device
cordova run android
```

### Build Release APK:

```bash
# Generate signing key (first time only)
keytool -genkey -v -keystore mdm-release-key.keystore \
  -alias mdm-key -keyalg RSA -keysize 2048 -validity 10000

# Build release APK
cordova build android --release

# Sign the APK (see PLAYSTORE-GUIDE.md for details)
```

Your APK will be in:
```
platforms/android/app/build/outputs/apk/release/
```

---

## 🌐 Method 4: Deploy to Your Own Server

### Deploy to Apache/Nginx:

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git

# 2. Copy to web server directory
sudo cp -r mobile-mdm-system /var/www/html/mdm

# 3. Set permissions
sudo chown -R www-data:www-data /var/www/html/mdm

# 4. Access via browser
# http://your-domain.com/mdm
```

### Deploy to Netlify (Free):

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Navigate to project
cd mobile-mdm-system

# 3. Deploy
netlify deploy

# Follow prompts
# Your site will be live at: https://your-site.netlify.app
```

### Deploy to Vercel (Free):

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project
cd mobile-mdm-system

# 3. Deploy
vercel

# Follow prompts
# Your site will be live at: https://your-project.vercel.app
```

### Deploy to GitHub Pages:

```bash
# Already on GitHub? Enable Pages:
# 1. Go to repository Settings
# 2. Scroll to "Pages"
# 3. Select "main" branch
# 4. Click Save
# 5. Visit: https://YOUR_USERNAME.github.io/mobile-mdm-system/
```

---

## ✅ Verify Installation

After installation, verify everything works:

### Web App Checklist:
- [ ] Open index.html or visit URL
- [ ] Dashboard loads with statistics
- [ ] Can navigate between pages
- [ ] Sample devices are visible
- [ ] Can click on devices to view details
- [ ] Can create new device
- [ ] Can lock/unlock devices
- [ ] Alerts system works
- [ ] App control page loads

### Android App Checklist:
- [ ] APK installs successfully
- [ ] App opens without crashes
- [ ] All features accessible
- [ ] Device permissions requested
- [ ] Location tracking works
- [ ] Battery monitoring active
- [ ] Network detection works

---

## 🐛 Troubleshooting

### Issue: "File not found" or "404 Error"
**Solution:**
```bash
# Ensure you're in correct directory
pwd
ls -la

# Should see index.html, css/, js/ folders
```

### Issue: "Cordova not found"
**Solution:**
```bash
npm install -g cordova
# Or
sudo npm install -g cordova
```

### Issue: "Permission denied" on setup script
**Solution:**
```bash
chmod +x cordova/setup-android-app.sh
bash cordova/setup-android-app.sh
```

### Issue: Android build fails
**Solution:**
```bash
# Check Java version
java -version
# Should be Java 8 or higher

# Check Android SDK
echo $ANDROID_HOME
# Should point to Android SDK location

# Set ANDROID_HOME if not set
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Issue: "Cannot find module"
**Solution:**
```bash
# Install dependencies
npm install

# Clear npm cache
npm cache clean --force
```

### Issue: App doesn't work in browser
**Solution:**
- Check browser console for errors (F12)
- Ensure JavaScript is enabled
- Try different browser
- Clear browser cache
- Use local server instead of file://

### Issue: GitHub Pages not updating
**Solution:**
```bash
# Force push
git add .
git commit -m "Update"
git push -f origin main

# Wait 2-3 minutes for GitHub to rebuild
# Clear browser cache
```

---

## 📋 System Requirements

### For Web App:
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **JavaScript**: Enabled
- **Storage**: Local storage enabled
- **Internet**: Not required (works offline after first load)

### For Development:
- **Node.js**: 14.0.0 or higher
- **npm**: 6.0.0 or higher
- **Git**: Any recent version
- **Text Editor**: VS Code, Sublime, Atom, etc.

### For Android Development:
- **Node.js**: 14.0.0+
- **Java JDK**: 8 or 11 (not 9, 10, or 12+)
- **Android SDK**: API Level 24+ (Android 7.0+)
- **Gradle**: 7.0+ (auto-installed by Cordova)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space

### For iOS Development (Mac only):
- **macOS**: 10.15.4+
- **Xcode**: 12.0+
- **CocoaPods**: Latest version
- **Apple Developer Account**: $99/year

---

## 🎓 Next Steps

After successful installation:

1. **Explore the App**
   - Open dashboard
   - View sample devices
   - Try locking a device
   - Create a policy

2. **Read Documentation**
   - [QUICKSTART.md](QUICKSTART.md) - Quick tour
   - [README.md](README.md) - Full documentation
   - [PLAYSTORE-GUIDE.md](PLAYSTORE-GUIDE.md) - Publishing guide

3. **Customize**
   - Edit `js/mdm-data.js` for sample data
   - Modify `css/mdm-styles.css` for styling
   - Update `cordova/config.xml` for app settings

4. **Deploy**
   - Host on GitHub Pages
   - Deploy to your server
   - Publish to Play Store

---

## 📞 Getting Help

- **Documentation**: Read all .md files
- **Issues**: https://github.com/YOUR_USERNAME/mobile-mdm-system/issues
- **Cordova Docs**: https://cordova.apache.org/docs/
- **Stack Overflow**: Tag questions with `cordova` and `mdm`

---

## 🎉 Installation Complete!

You should now have the MDM system running. Test all features and refer to the documentation for customization and deployment options.

**Enjoy managing your mobile devices!** 📱🔒
