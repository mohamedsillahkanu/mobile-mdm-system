# 📋 Quick Reference Card

## 🚀 GitHub Setup (One-Time)

```bash
# 1. Navigate to your project
cd mobile-mdm-system

# 2. Initialize Git
git init
git add .
git commit -m "Initial commit: MDM System v1.0"

# 3. Create repository on GitHub
# Go to: https://github.com/new
# Repository name: mobile-mdm-system

# 4. Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/mobile-mdm-system.git
git branch -M main
git push -u origin main

# 5. Enable GitHub Pages (for free hosting)
# Settings → Pages → Source: main branch → Save
# Your app will be live at:
# https://YOUR_USERNAME.github.io/mobile-mdm-system/
```

---

## 📥 Installation Commands (For Users)

### Instant Use (No Installation)
```bash
# Just visit:
https://YOUR_USERNAME.github.io/mobile-mdm-system/
```

### Clone and Run
```bash
# Clone
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git

# Open
cd mobile-mdm-system
# Then open index.html in browser

# OR run with server
python -m http.server 8000
# Visit http://localhost:8000
```

### With NPM
```bash
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git
cd mobile-mdm-system
npm install
npm start
# Opens automatically in browser
```

---

## 📱 Android App Build

```bash
# Quick method
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git
cd mobile-mdm-system/cordova
bash setup-android-app.sh

# Manual method
npm install -g cordova
cordova create MDMApp com.yourcompany.mdm "MDM System"
cd MDMApp
cordova platform add android
# Copy your files to www/
cordova build android
```

---

## 🔄 Daily Git Workflow

```bash
# Pull latest changes
git pull origin main

# Make changes, then:
git add .
git commit -m "Your descriptive message"
git push origin main

# Create version tag
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

---

## 📦 Key Files in Repository

```
mobile-mdm-system/
├── .gitignore              ← Git ignore rules
├── LICENSE                 ← MIT License
├── README.md              ← Main documentation
├── GITHUB-GUIDE.md        ← This guide (GitHub setup)
├── INSTALL.md             ← Installation instructions
├── QUICKSTART.md          ← 3-minute quick start
├── PLAYSTORE-GUIDE.md     ← Play Store publishing
├── package.json           ← NPM configuration
├── index.html             ← Main app
├── css/mdm-styles.css     ← Styling
├── js/
│   ├── mdm-data.js        ← Data management
│   ├── mdm-ui.js          ← UI rendering
│   └── mdm-app.js         ← App initialization
└── cordova/
    ├── config.xml         ← Cordova configuration
    ├── cordova-integration.js  ← Native features
    └── setup-android-app.sh    ← Automated setup
```

---

## 🎯 Common Tasks

### Test Locally
```bash
open index.html
# or
python -m http.server 8000
```

### Build Android APK
```bash
cd cordova
cordova build android --release
```

### Deploy to GitHub Pages
```bash
# Automatic - just push to main branch
git push origin main
# GitHub auto-deploys to:
# https://YOUR_USERNAME.github.io/mobile-mdm-system/
```

### Update Dependencies
```bash
npm install
npm update
```

### Generate Signing Key
```bash
keytool -genkey -v -keystore mdm-release-key.keystore \
  -alias mdm-key -keyalg RSA -keysize 2048 -validity 10000
```

---

## 🆘 Troubleshooting Quick Fixes

```bash
# Git issues
git status
git remote -v

# Node/NPM issues
npm cache clean --force
npm install

# Cordova issues
cordova clean
cordova platform rm android
cordova platform add android

# Permission issues
chmod +x cordova/setup-android-app.sh

# Port already in use
python -m http.server 8001  # Use different port
```

---

## 📞 Quick Links

- **GitHub Repository**: https://github.com/YOUR_USERNAME/mobile-mdm-system
- **Live Demo**: https://YOUR_USERNAME.github.io/mobile-mdm-system/
- **Issues**: https://github.com/YOUR_USERNAME/mobile-mdm-system/issues
- **Releases**: https://github.com/YOUR_USERNAME/mobile-mdm-system/releases

---

## ✅ Checklist Before First Push

- [ ] Updated YOUR_USERNAME in all docs
- [ ] Updated author name/email in package.json
- [ ] Tested app locally
- [ ] Created .gitignore file
- [ ] Added LICENSE file
- [ ] README.md is complete
- [ ] Removed any sensitive data
- [ ] Tested git commands

---

## 🎉 You're Ready!

```bash
# Share your repository:
git clone https://github.com/YOUR_USERNAME/mobile-mdm-system.git
cd mobile-mdm-system
npm start

# That's it! 🚀
```

---

**Print this page for quick reference!**
