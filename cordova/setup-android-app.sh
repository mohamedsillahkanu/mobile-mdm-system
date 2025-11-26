#!/bin/bash

# MDM System - Android App Setup Script
# This script automates the conversion of your web app to Android

echo "======================================"
echo "MDM System - Android App Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✓ Node.js is installed${NC}"
fi

# Check if Cordova is installed
if ! command -v cordova &> /dev/null; then
    echo -e "${YELLOW}⚠ Cordova is not installed. Installing...${NC}"
    npm install -g cordova
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Cordova installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Cordova${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ Cordova is installed${NC}"
fi

echo ""
echo "======================================"
echo "Creating Cordova Project"
echo "======================================"
echo ""

# Get app details from user
read -p "Enter your company domain (e.g., yourcompany.com): " DOMAIN
read -p "Enter app name (default: MDM System): " APP_NAME
APP_NAME=${APP_NAME:-"MDM System"}

PACKAGE_ID="com.${DOMAIN}.mdm"

# Create Cordova project
echo "Creating Cordova project..."
cordova create MDMApp $PACKAGE_ID "$APP_NAME"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create Cordova project${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Cordova project created${NC}"

# Navigate to project directory
cd MDMApp

# Add Android platform
echo ""
echo "Adding Android platform..."
cordova platform add android

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to add Android platform${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Android platform added${NC}"

# Copy web files
echo ""
echo "======================================"
echo "Copying Web Files"
echo "======================================"
echo ""

echo "Please copy your web files to the www/ directory:"
echo "1. index.html"
echo "2. css/ folder"
echo "3. js/ folder"
echo ""
read -p "Press Enter when you've copied the files..."

# Add Cordova plugins
echo ""
echo "======================================"
echo "Installing Cordova Plugins"
echo "======================================"
echo ""

PLUGINS=(
    "cordova-plugin-device"
    "cordova-plugin-geolocation"
    "cordova-plugin-network-information"
    "cordova-plugin-battery-status"
    "cordova-plugin-vibration"
    "cordova-plugin-camera"
    "cordova-plugin-file"
    "cordova-plugin-dialogs"
    "cordova-plugin-statusbar"
    "cordova-plugin-splashscreen"
    "cordova-plugin-whitelist"
)

for plugin in "${PLUGINS[@]}"; do
    echo "Installing $plugin..."
    cordova plugin add $plugin
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $plugin installed${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: $plugin installation failed${NC}"
    fi
done

# Copy config.xml if available
echo ""
echo "Copying configuration files..."
if [ -f "../cordova/config.xml" ]; then
    cp ../cordova/config.xml config.xml
    echo -e "${GREEN}✓ config.xml copied${NC}"
fi

# Add Cordova integration script
if [ -f "../cordova/cordova-integration.js" ]; then
    cp ../cordova/cordova-integration.js www/js/
    echo -e "${GREEN}✓ cordova-integration.js copied${NC}"
    
    # Add script tag to index.html
    echo "Don't forget to add this line to your index.html <head> section:"
    echo '<script src="js/cordova-integration.js"></script>'
fi

# Create icons directory
echo ""
echo "Creating icons directory..."
mkdir -p res/android/icon
mkdir -p res/android/splash

echo ""
echo "======================================"
echo "Next Steps"
echo "======================================"
echo ""
echo "1. Add app icons to res/android/icon/"
echo "   - Generate icons: https://romannurik.github.io/AndroidAssetStudio/"
echo ""
echo "2. Add splash screens to res/android/splash/"
echo ""
echo "3. Update config.xml with your details:"
echo "   - Author name and email"
echo "   - App description"
echo "   - Permissions as needed"
echo ""
echo "4. Build the app:"
echo "   ${GREEN}cordova build android${NC}"
echo ""
echo "5. Test on device:"
echo "   ${GREEN}cordova run android${NC}"
echo ""
echo "6. Build release APK:"
echo "   ${GREEN}cordova build android --release${NC}"
echo ""
echo "7. Sign the APK (see PLAYSTORE-GUIDE.md)"
echo ""

# Generate signing key
echo ""
read -p "Do you want to generate a signing key now? (y/n): " GENERATE_KEY

if [ "$GENERATE_KEY" = "y" ] || [ "$GENERATE_KEY" = "Y" ]; then
    echo ""
    read -p "Enter key alias (e.g., mdm-key): " KEY_ALIAS
    read -p "Enter keystore password: " -s KEYSTORE_PASS
    echo ""
    
    keytool -genkey -v -keystore mdm-release-key.keystore \
        -alias $KEY_ALIAS -keyalg RSA -keysize 2048 -validity 10000
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Signing key generated${NC}"
        echo ""
        echo "⚠ IMPORTANT: Keep mdm-release-key.keystore safe!"
        echo "You cannot update your app without it!"
        echo ""
        echo "Keystore location: $(pwd)/mdm-release-key.keystore"
    fi
fi

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "Your Cordova project is ready at: $(pwd)"
echo ""
echo "Quick commands:"
echo "  Build: cordova build android"
echo "  Run: cordova run android"
echo "  Release: cordova build android --release"
echo ""
echo "See PLAYSTORE-GUIDE.md for Play Store publishing instructions"
echo ""
