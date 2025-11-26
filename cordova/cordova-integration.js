/**
 * Cordova Integration for MDM System
 * This file bridges web app functionality with native device capabilities
 */

class CordovaDeviceManager {
    constructor() {
        this.isReady = false;
        this.deviceInfo = null;
    }

    /**
     * Initialize Cordova integration
     */
    init() {
        document.addEventListener('deviceready', () => {
            console.log('Cordova device is ready');
            this.isReady = true;
            this.onDeviceReady();
        }, false);
    }

    /**
     * Called when Cordova is ready
     */
    onDeviceReady() {
        this.getDeviceInformation();
        this.setupBatteryMonitoring();
        this.setupLocationTracking();
        this.setupNetworkMonitoring();
        this.requestPermissions();
    }

    /**
     * Get comprehensive device information
     */
    getDeviceInformation() {
        if (typeof device === 'undefined') {
            console.error('Cordova device plugin not available');
            return null;
        }

        this.deviceInfo = {
            // Basic device info
            uuid: device.uuid,              // Unique device ID
            model: device.model,            // Device model
            platform: device.platform,      // Android or iOS
            version: device.version,        // OS version
            manufacturer: device.manufacturer,
            isVirtual: device.isVirtual,
            serial: device.serial,          // Serial number
            
            // Additional info
            cordova: device.cordova,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timestamp: new Date().toISOString()
        };

        console.log('Device Information:', this.deviceInfo);
        
        // Store in MDM system
        this.updateMDMDevice(this.deviceInfo);
        
        return this.deviceInfo;
    }

    /**
     * Get IMEI (Android only, requires special permissions)
     * Note: IMEI access is restricted on modern Android versions
     */
    async getIMEI() {
        // For Android API 29+, you need READ_PRIVILEGED_PHONE_STATE
        // This requires system-level permissions or device owner mode
        
        if (window.cordova && cordova.platformId === 'android') {
            try {
                // Custom plugin would be needed for IMEI
                // Example using custom plugin:
                /*
                cordova.exec(
                    (imei) => {
                        console.log('IMEI:', imei);
                        return imei;
                    },
                    (error) => {
                        console.error('IMEI Error:', error);
                        return device.uuid; // Fallback to UUID
                    },
                    'DeviceInfo',
                    'getIMEI',
                    []
                );
                */
                
                // Fallback: Use device UUID as unique identifier
                return device.uuid;
            } catch (error) {
                console.error('IMEI access error:', error);
                return device.uuid;
            }
        }
        
        return device.uuid; // For iOS or fallback
    }

    /**
     * Monitor battery status
     */
    setupBatteryMonitoring() {
        window.addEventListener('batterystatus', (info) => {
            const batteryData = {
                level: info.level,              // 0-100
                isPlugged: info.isPlugged      // true if charging
            };
            
            console.log('Battery Status:', batteryData);
            this.updateBatteryStatus(batteryData);
            
            // Alert if battery is low
            if (info.level < 20 && !info.isPlugged) {
                this.sendAlert('Low battery warning', 'warning');
            }
        }, false);

        window.addEventListener('batterylow', () => {
            console.log('Battery is low!');
            this.sendAlert('Critical: Battery is low', 'critical');
        }, false);

        window.addEventListener('batterycritical', () => {
            console.log('Battery is critical!');
            this.sendAlert('Critical: Battery critically low', 'critical');
        }, false);
    }

    /**
     * Track device location
     */
    setupLocationTracking() {
        // Watch position continuously
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const locationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    timestamp: position.timestamp
                };
                
                console.log('Location Update:', locationData);
                this.updateDeviceLocation(locationData);
            },
            (error) => {
                console.error('Location error:', error);
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        this.sendAlert('Location permission denied', 'high');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log('Location unavailable');
                        break;
                    case error.TIMEOUT:
                        console.log('Location request timeout');
                        break;
                }
            },
            {
                enableHighAccuracy: true,
                maximumAge: 30000,
                timeout: 27000
            }
        );

        // Store watchId to clear later if needed
        this.locationWatchId = watchId;
    }

    /**
     * Get current location once
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => reject(error),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    /**
     * Monitor network status
     */
    setupNetworkMonitoring() {
        const checkConnection = () => {
            const networkState = navigator.connection.type;
            const states = {};
            states[Connection.UNKNOWN]  = 'Unknown';
            states[Connection.ETHERNET] = 'Ethernet';
            states[Connection.WIFI]     = 'WiFi';
            states[Connection.CELL_2G]  = '2G';
            states[Connection.CELL_3G]  = '3G';
            states[Connection.CELL_4G]  = '4G';
            states[Connection.CELL]     = 'Cellular';
            states[Connection.NONE]     = 'No network';

            console.log('Network:', states[networkState]);
            
            if (networkState === Connection.NONE) {
                this.sendAlert('Device is offline', 'medium');
            }
            
            return states[networkState];
        };

        // Check on online/offline events
        document.addEventListener('online', () => {
            console.log('Device is online');
            checkConnection();
        }, false);

        document.addEventListener('offline', () => {
            console.log('Device is offline');
            this.sendAlert('Device went offline', 'high');
        }, false);

        // Initial check
        if (navigator.connection) {
            checkConnection();
        }
    }

    /**
     * Request necessary permissions
     */
    async requestPermissions() {
        // Location permission
        await this.requestLocationPermission();
        
        // Storage permission (if needed)
        await this.requestStoragePermission();
        
        // Camera permission (to control camera access)
        await this.requestCameraPermission();
    }

    requestLocationPermission() {
        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                () => {
                    console.log('Location permission granted');
                    resolve(true);
                },
                () => {
                    console.log('Location permission denied');
                    resolve(false);
                }
            );
        });
    }

    requestStoragePermission() {
        // Implement if using file storage
        return Promise.resolve(true);
    }

    requestCameraPermission() {
        // Implement if controlling camera
        return Promise.resolve(true);
    }

    /**
     * Get list of installed apps (requires custom plugin)
     */
    async getInstalledApps() {
        // This requires a custom Cordova plugin
        // Example implementation:
        /*
        return new Promise((resolve, reject) => {
            cordova.exec(
                (apps) => resolve(apps),
                (error) => reject(error),
                'AppList',
                'getInstalledApps',
                []
            );
        });
        */
        
        console.log('Get installed apps - requires custom plugin');
        return [];
    }

    /**
     * Block an app (requires Device Admin privileges)
     */
    async blockApp(packageName) {
        // Requires Device Admin API or Android Enterprise
        console.log('Block app:', packageName);
        
        // Example with custom plugin:
        /*
        return new Promise((resolve, reject) => {
            cordova.exec(
                () => {
                    console.log('App blocked:', packageName);
                    resolve(true);
                },
                (error) => {
                    console.error('Failed to block app:', error);
                    reject(error);
                },
                'DeviceAdmin',
                'blockApp',
                [packageName]
            );
        });
        */
        
        return Promise.resolve(false);
    }

    /**
     * Lock device (requires Device Admin)
     */
    lockDevice() {
        console.log('Locking device...');
        
        // Example with custom plugin:
        /*
        cordova.exec(
            () => {
                console.log('Device locked');
                this.sendAlert('Device has been locked', 'critical');
            },
            (error) => {
                console.error('Failed to lock device:', error);
            },
            'DeviceAdmin',
            'lockDevice',
            []
        );
        */
        
        // Fallback: Show lock screen notification
        if (navigator.notification) {
            navigator.notification.alert(
                'This device has been locked by administrator',
                () => {},
                'Device Locked',
                'OK'
            );
        }
    }

    /**
     * Wipe device data (requires Device Admin)
     */
    wipeDevice() {
        console.log('Wiping device...');
        
        // EXTREME CAUTION: This erases all data
        /*
        cordova.exec(
            () => {
                console.log('Device wipe initiated');
            },
            (error) => {
                console.error('Failed to wipe device:', error);
            },
            'DeviceAdmin',
            'wipeData',
            []
        );
        */
        
        alert('Device wipe requires Device Admin privileges');
    }

    /**
     * Vibrate device for alerts
     */
    vibrateAlert(pattern = [1000, 500, 1000]) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    /**
     * Show native notification
     */
    showNotification(title, message, buttonName = 'OK') {
        if (navigator.notification) {
            navigator.notification.alert(
                message,
                () => {},
                title,
                buttonName
            );
        }
    }

    /**
     * Update MDM system with device info
     */
    updateMDMDevice(deviceData) {
        if (typeof mdmData !== 'undefined') {
            const currentDevice = mdmData.getDevices().find(d => 
                d.imei === deviceData.uuid || d.uuid === deviceData.uuid
            );
            
            if (currentDevice) {
                mdmData.updateDevice(currentDevice.id, {
                    model: deviceData.model,
                    os: deviceData.platform,
                    osVersion: deviceData.version,
                    lastSeen: new Date().toISOString()
                });
            }
        }
    }

    /**
     * Update battery status in MDM
     */
    updateBatteryStatus(batteryData) {
        if (typeof mdmData !== 'undefined' && this.deviceInfo) {
            const currentDevice = mdmData.getDevices().find(d => 
                d.imei === this.deviceInfo.uuid
            );
            
            if (currentDevice) {
                mdmData.updateDevice(currentDevice.id, {
                    battery: batteryData.level,
                    lastSeen: new Date().toISOString()
                });
            }
        }
    }

    /**
     * Update location in MDM
     */
    updateDeviceLocation(locationData) {
        if (typeof mdmData !== 'undefined' && this.deviceInfo) {
            const currentDevice = mdmData.getDevices().find(d => 
                d.imei === this.deviceInfo.uuid
            );
            
            if (currentDevice) {
                mdmData.updateDevice(currentDevice.id, {
                    location: {
                        lat: locationData.latitude,
                        lng: locationData.longitude,
                        address: 'Unknown' // Reverse geocoding needed
                    },
                    lastSeen: new Date().toISOString()
                });
            }
        }
    }

    /**
     * Send alert to MDM system
     */
    sendAlert(message, severity) {
        if (typeof mdmData !== 'undefined' && this.deviceInfo) {
            mdmData.addAlert({
                deviceId: this.deviceInfo.uuid,
                deviceName: this.deviceInfo.model,
                severity: severity,
                type: 'security',
                message: message,
                timestamp: new Date().toISOString(),
                acknowledged: false
            });
        }
    }
}

// Initialize Cordova integration
const cordovaDevice = new CordovaDeviceManager();

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        cordovaDevice.init();
    });
} else {
    cordovaDevice.init();
}

// Export for use in other scripts
window.cordovaDevice = cordovaDevice;
