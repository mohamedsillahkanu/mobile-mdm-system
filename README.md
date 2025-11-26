# Mobile Device Management (MDM) System

A comprehensive, production-ready Mobile Device Management system for monitoring, controlling, and securing mobile devices. Built with HTML, CSS, and JavaScript - no backend required for the frontend demo.

## 🚀 Features

### Core Functionality
- **Device Enrollment**: Register devices with IMEI tracking
- **Remote Lock**: Lock devices remotely via IMEI
- **Remote Wipe**: Erase device data remotely
- **App Control**: Block, allow, or monitor specific applications
- **Policy Management**: Create and enforce device policies
- **Location Tracking**: Monitor device locations
- **Real-time Monitoring**: Track device status, battery, storage
- **Alert System**: Security alerts and notifications
- **Activity Log**: Complete audit trail of all actions

### Device Management
- Enroll/Unenroll devices
- Lock/Unlock devices
- Wipe device data
- Track device location
- Monitor battery and storage
- View installed applications
- Track last seen time

### Application Control
- **Block Apps**: Prevent installation/usage of specific apps
- **Allow-list**: Only permit approved applications
- **Monitor Apps**: Track app usage without blocking
- Apply rules to individual or multiple devices

### Policy Enforcement
- Security policies (passwords, encryption)
- Network policies (WiFi, VPN requirements)
- Device restrictions (camera, screenshots)
- Automatic policy enforcement

### Security Alerts
- Policy violations
- Unauthorized app installations
- Location-based alerts (geofencing)
- Device tampering detection
- Low battery warnings

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server required for demo
- Local storage enabled

## 🛠️ Installation

### Quick Start
1. Download all files
2. Open `index.html` in your web browser
3. Start managing devices immediately

### Local Server (Recommended)
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 📁 Project Structure

```
mobile-mdm-system/
│
├── index.html              # Main application
├── css/
│   └── mdm-styles.css      # All styling
├── js/
│   ├── mdm-data.js         # Data management
│   ├── mdm-ui.js           # UI rendering
│   └── mdm-app.js          # Main initialization
└── README.md               # This file
```

## 🎯 Usage Guide

### Dashboard
- View total devices, active devices, locked devices
- Monitor active alerts
- See recent activity feed
- Visual location map (placeholder for production integration)

### Enrolling a Device

1. Navigate to "Devices" page
2. Click "Enroll Device"
3. Fill in device information:
   - **Device Name** (required)
   - **IMEI Number** (required, 15 digits)
   - Model
   - Operating System (Android/iOS)
   - Owner information
4. Click "Enroll Device"

### Managing Devices

**View Device Details:**
- Click on any device card
- See complete device information
- View battery, storage, location

**Lock Device (by IMEI):**
1. Click on device
2. Click "Lock Device"
3. Confirm action
4. Device is remotely locked

**Locate Device:**
1. Click on device
2. Click "Locate Device"
3. View device location

**Wipe Device:**
1. Click on device
2. Click "Wipe Device"
3. Confirm (WARNING: Irreversible!)
4. All data is erased

### Application Control

**Block an Application:**
1. Go to "App Control"
2. Click "Add App Rule"
3. Enter:
   - Application name
   - Package name (e.g., com.facebook.app)
   - Select "Block" action
   - Choose devices to apply
4. Click "Add Rule"

**Allow-list Apps:**
- Select "Allow Only This" action
- Only specified apps can be installed

**Monitor App Usage:**
- Select "Monitor" action
- Track usage without blocking

### Policy Management

**Create Policy:**
1. Go to "Policies"
2. Click "Create Policy"
3. Enter:
   - Policy name
   - Policy type (Security/Network/Restriction)
   - Description
   - Enforcement toggle
4. Click "Create Policy"

**Policy Types:**
- **Security**: Password requirements, encryption
- **Network**: WiFi, VPN, data usage
- **Restriction**: Camera, screenshots, app stores

### Alerts & Notifications

**View Alerts:**
- Navigate to "Alerts" page
- Filter by severity or type
- View unacknowledged alerts first

**Acknowledge Alert:**
- Click "Acknowledge" button
- Alert is marked as handled

**Alert Types:**
- Security (critical/high/medium/low)
- Policy violations
- App installations
- Location-based
- Device status

## 💾 Data Storage

Uses browser Local Storage:
- **Storage Key**: `mdm_devices_data`
- **Format**: JSON
- **Persistence**: Survives page reloads
- **Capacity**: ~5-10MB

### Sample Data Included
- 4 demo devices (iPhones, Android phones)
- 6 policies across categories
- 5 app control rules
- 5 security alerts
- Activity history

## 🔐 IMEI-Based Device Lock

### How It Works
1. Each device is registered with its unique IMEI
2. Lock command is issued to device via MDM protocol
3. Device receives lock command
4. Device locks and requires unlock code
5. Only administrator can unlock

### Production Implementation
For real-world deployment:
```javascript
// Example API call to device
async function lockDeviceByIMEI(imei) {
    await fetch(`${MDM_API}/devices/${imei}/lock`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'lock',
            message: 'Device locked by administrator'
        })
    });
}
```

## 🔧 Customization

### Adding Custom Policies
Edit `mdm-data.js`, `initializeSampleData()`:
```javascript
{
    id: 'POL007',
    name: 'Your Policy',
    type: 'security',
    description: 'Your description',
    enforced: true
}
```

### Modifying App Lists
```javascript
{
    id: 'APP006',
    name: 'WhatsApp',
    packageName: 'com.whatsapp',
    action: 'block',
    devices: ['DEV001'],
    reason: 'Company policy'
}
```

### Custom Styling
Edit `css/mdm-styles.css`:
```css
:root {
    --primary-color: #3b82f6;  /* Your brand color */
    --danger-color: #ef4444;
}
```

## 📱 Integration with Real Devices

### Android Integration (Production)
Use Android Enterprise APIs or MDM protocols:

```java
// Android Device Policy Controller
DevicePolicyManager dpm = (DevicePolicyManager) 
    getSystemService(Context.DEVICE_POLICY_SERVICE);

// Lock device
dpm.lockNow();

// Wipe device
dpm.wipeData(0);

// Disable app
dpm.setApplicationHidden(adminComponent, packageName, true);
```

### iOS Integration (Production)
Use Apple DEP and MDM protocol:

```swift
// iOS MDM Profile
{
    "PayloadType": "Configuration",
    "PayloadIdentifier": "com.your.mdm",
    "PayloadUUID": "...",
    "PayloadVersion": 1,
    "PayloadContent": [{
        "PayloadType": "com.apple.mdm",
        "ServerURL": "https://your-mdm-server.com"
    }]
}
```

### Backend API Example (Node.js)

```javascript
// Express.js MDM Backend
const express = require('express');
const app = express();

app.post('/api/devices/:imei/lock', async (req, res) => {
    const { imei } = req.params;
    
    // Send push notification to device
    await sendAPNS(imei, {
        command: 'DeviceLock',
        message: 'Device locked by administrator'
    });
    
    res.json({ success: true });
});

app.post('/api/devices/:imei/locate', async (req, res) => {
    const location = await getDeviceLocation(imei);
    res.json({ location });
});
```

## 🚢 Production Deployment

### Backend Requirements
- **Authentication**: OAuth 2.0, JWT
- **Database**: PostgreSQL, MongoDB
- **Push Notifications**: 
  - Apple Push Notification service (APNs) for iOS
  - Firebase Cloud Messaging (FCM) for Android
- **API**: REST or GraphQL
- **Security**: HTTPS, encryption

### Architecture
```
Mobile Devices
      ↓
Push Notifications (APNs/FCM)
      ↓
MDM Server (Node.js/Java/Python)
      ↓
Database (PostgreSQL/MongoDB)
      ↓
Web Dashboard (This App)
```

### Required Services
1. **Certificate Server**: Handle device certificates
2. **Push Notification Service**: Send commands to devices
3. **Geolocation Service**: Track device locations
4. **Authentication Service**: User/device authentication
5. **Logging Service**: Audit trail and compliance

## 📊 Sample Data

### Devices
- John's iPhone (Active)
- Sarah's Galaxy (Active)
- Mike's Pixel (Locked)
- Lisa's iPhone (Pending)

### Policies
- Password required
- Encryption mandatory
- WiFi-only updates
- VPN required
- Camera disabled
- Screenshot prevention

### App Rules
- Facebook (Blocked)
- Instagram (Blocked)
- TikTok (Blocked)
- Corporate App (Allowed)
- Twitter (Monitored)

## 🐛 Troubleshooting

**Issue: Devices not appearing**
- Check local storage is enabled
- Clear browser cache
- Refresh page

**Issue: Lock command not working**
- This is a demo - real implementation requires MDM protocol
- In production, device must be enrolled in MDM
- Device needs push notification connectivity

**Issue: Location not showing**
- Location data is simulated in demo
- Production needs GPS/network location services
- Requires device permissions

## 🔄 API Reference

### JavaScript Functions

```javascript
// Enroll device
mdmData.enrollDevice(deviceObject)

// Lock device by IMEI
mdmData.lockDevice(deviceId)

// Unlock device
mdmData.unlockDevice(deviceId)

// Wipe device
mdmData.wipeDevice(deviceId)

// Add app rule
mdmData.addAppRule(ruleObject)

// Create policy
mdmData.addPolicy(policyObject)

// Get alerts
mdmData.getAlerts(filters)

// Export data
window.exportMDMData()

// Import data
window.importMDMData(jsonString)
```

## 📄 License

Open source - Free to use and modify

## 🎓 Learning Resources

**MDM Concepts:**
- Device enrollment protocols
- Mobile application management (MAM)
- Mobile content management (MCM)
- Mobile identity management (MIM)

**Technologies:**
- Android Enterprise
- Apple Business Manager
- Push notifications (APNs, FCM)
- Device certificates
- MDM protocols

## ✅ Production Checklist

- [ ] Set up backend API
- [ ] Integrate with APNs (iOS)
- [ ] Integrate with FCM (Android)
- [ ] Implement user authentication
- [ ] Set up database
- [ ] Enable HTTPS
- [ ] Implement device enrollment
- [ ] Set up push notifications
- [ ] Add geolocation services
- [ ] Implement logging/audit
- [ ] Security audit
- [ ] Compliance review
- [ ] Load testing
- [ ] Documentation
- [ ] Training materials

## 🚀 Next Steps

1. **Test locally** with sample data
2. **Customize** policies and rules
3. **Design backend** architecture
4. **Implement** device communication
5. **Deploy** to production
6. **Monitor** and maintain

---

**Built for device security and management** 🔒📱

For questions or support, refer to MDM protocol documentation and mobile platform guidelines.
