// Mobile Device Management - Data Manager
class MDMDataManager {
    constructor() {
        this.storageKey = 'mdm_devices_data';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.storageKey)) {
            this.initializeSampleData();
        }
    }

    initializeSampleData() {
        const sampleData = {
            devices: [
                {
                    id: 'DEV001',
                    name: 'John\'s iPhone',
                    imei: '352099001761481',
                    model: 'iPhone 13 Pro',
                    os: 'iOS',
                    osVersion: '16.5',
                    status: 'active',
                    owner: 'John Doe',
                    phone: '+1234567890',
                    email: 'john@example.com',
                    enrolledDate: '2024-01-15',
                    lastSeen: new Date().toISOString(),
                    location: { lat: 37.7749, lng: -122.4194, address: 'San Francisco, CA' },
                    battery: 85,
                    storage: { used: 45, total: 128 },
                    apps: ['com.example.app1', 'com.social.facebook', 'com.social.instagram']
                },
                {
                    id: 'DEV002',
                    name: 'Sarah\'s Galaxy',
                    imei: '352099001761482',
                    model: 'Samsung Galaxy S22',
                    os: 'Android',
                    osVersion: '13.0',
                    status: 'active',
                    owner: 'Sarah Smith',
                    phone: '+1234567891',
                    email: 'sarah@example.com',
                    enrolledDate: '2024-02-10',
                    lastSeen: new Date(Date.now() - 3600000).toISOString(),
                    location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' },
                    battery: 62,
                    storage: { used: 80, total: 256 },
                    apps: ['com.example.app1', 'com.social.twitter', 'com.game.candycrush']
                },
                {
                    id: 'DEV003',
                    name: 'Mike\'s Pixel',
                    imei: '352099001761483',
                    model: 'Google Pixel 7',
                    os: 'Android',
                    osVersion: '14.0',
                    status: 'locked',
                    owner: 'Mike Johnson',
                    phone: '+1234567892',
                    email: 'mike@example.com',
                    enrolledDate: '2024-03-05',
                    lastSeen: new Date(Date.now() - 7200000).toISOString(),
                    location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
                    battery: 15,
                    storage: { used: 100, total: 128 },
                    apps: ['com.example.app1', 'com.social.tiktok']
                },
                {
                    id: 'DEV004',
                    name: 'Lisa\'s iPhone',
                    imei: '352099001761484',
                    model: 'iPhone 14',
                    os: 'iOS',
                    osVersion: '17.0',
                    status: 'pending',
                    owner: 'Lisa Brown',
                    phone: '+1234567893',
                    email: 'lisa@example.com',
                    enrolledDate: new Date().toISOString().split('T')[0],
                    lastSeen: new Date(Date.now() - 1800000).toISOString(),
                    location: null,
                    battery: 100,
                    storage: { used: 20, total: 256 },
                    apps: []
                }
            ],
            policies: [
                {
                    id: 'POL001',
                    name: 'Password Required',
                    type: 'security',
                    description: 'All devices must have a password/PIN set',
                    enforced: true,
                    createdDate: '2024-01-01'
                },
                {
                    id: 'POL002',
                    name: 'Encryption Mandatory',
                    type: 'security',
                    description: 'Device encryption must be enabled',
                    enforced: true,
                    createdDate: '2024-01-01'
                },
                {
                    id: 'POL003',
                    name: 'WiFi Only for Updates',
                    type: 'network',
                    description: 'OS updates must be downloaded over WiFi only',
                    enforced: true,
                    createdDate: '2024-01-15'
                },
                {
                    id: 'POL004',
                    name: 'VPN Required',
                    type: 'network',
                    description: 'VPN must be active when accessing corporate resources',
                    enforced: true,
                    createdDate: '2024-02-01'
                },
                {
                    id: 'POL005',
                    name: 'Camera Disabled',
                    type: 'restriction',
                    description: 'Camera is disabled during work hours',
                    enforced: false,
                    createdDate: '2024-02-15'
                },
                {
                    id: 'POL006',
                    name: 'Screenshot Prevention',
                    type: 'restriction',
                    description: 'Screenshots are blocked in sensitive apps',
                    enforced: true,
                    createdDate: '2024-03-01'
                }
            ],
            appRules: [
                {
                    id: 'APP001',
                    name: 'Facebook',
                    packageName: 'com.social.facebook',
                    action: 'block',
                    devices: ['DEV001', 'DEV002'],
                    reason: 'Social media restricted during work hours'
                },
                {
                    id: 'APP002',
                    name: 'Instagram',
                    packageName: 'com.social.instagram',
                    action: 'block',
                    devices: ['DEV001'],
                    reason: 'Social media restricted'
                },
                {
                    id: 'APP003',
                    name: 'TikTok',
                    packageName: 'com.social.tiktok',
                    action: 'block',
                    devices: ['DEV003'],
                    reason: 'Potential security risk'
                },
                {
                    id: 'APP004',
                    name: 'Corporate App',
                    packageName: 'com.example.app1',
                    action: 'allow',
                    devices: ['DEV001', 'DEV002', 'DEV003'],
                    reason: 'Required for work'
                },
                {
                    id: 'APP005',
                    name: 'Twitter',
                    packageName: 'com.social.twitter',
                    action: 'monitor',
                    devices: ['DEV002'],
                    reason: 'Usage monitoring'
                }
            ],
            alerts: [
                {
                    id: 'ALR001',
                    deviceId: 'DEV003',
                    deviceName: 'Mike\'s Pixel',
                    severity: 'critical',
                    type: 'security',
                    message: 'Device has been locked due to multiple failed login attempts',
                    timestamp: new Date().toISOString(),
                    acknowledged: false
                },
                {
                    id: 'ALR002',
                    deviceId: 'DEV002',
                    deviceName: 'Sarah\'s Galaxy',
                    severity: 'high',
                    type: 'policy',
                    message: 'Policy violation: Unauthorized app installation detected',
                    timestamp: new Date(Date.now() - 3600000).toISOString(),
                    acknowledged: false
                },
                {
                    id: 'ALR003',
                    deviceId: 'DEV001',
                    deviceName: 'John\'s iPhone',
                    severity: 'medium',
                    type: 'app',
                    message: 'Blocked app access attempt: Facebook',
                    timestamp: new Date(Date.now() - 7200000).toISOString(),
                    acknowledged: false
                },
                {
                    id: 'ALR004',
                    deviceId: 'DEV003',
                    deviceName: 'Mike\'s Pixel',
                    severity: 'high',
                    type: 'location',
                    message: 'Device detected outside allowed geofence',
                    timestamp: new Date(Date.now() - 10800000).toISOString(),
                    acknowledged: true
                },
                {
                    id: 'ALR005',
                    deviceId: 'DEV002',
                    deviceName: 'Sarah\'s Galaxy',
                    severity: 'low',
                    type: 'security',
                    message: 'Low battery - device at 15%',
                    timestamp: new Date(Date.now() - 14400000).toISOString(),
                    acknowledged: true
                }
            ],
            activities: [
                {
                    action: 'Device Locked',
                    device: 'Mike\'s Pixel',
                    user: 'System',
                    timestamp: new Date().toISOString()
                },
                {
                    action: 'Device Enrolled',
                    device: 'Lisa\'s iPhone',
                    user: 'Admin',
                    timestamp: new Date(Date.now() - 1800000).toISOString()
                },
                {
                    action: 'App Blocked',
                    device: 'John\'s iPhone',
                    user: 'System',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    action: 'Policy Updated',
                    device: 'All Devices',
                    user: 'Admin',
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                }
            ]
        };

        this.saveData(sampleData);
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    // Devices
    getDevices(filters = {}) {
        const data = this.getData();
        let devices = data.devices || [];

        if (filters.search) {
            const search = filters.search.toLowerCase();
            devices = devices.filter(d => 
                d.name.toLowerCase().includes(search) ||
                d.imei.includes(search) ||
                d.model.toLowerCase().includes(search)
            );
        }

        if (filters.status) {
            devices = devices.filter(d => d.status === filters.status);
        }

        if (filters.os) {
            devices = devices.filter(d => d.os === filters.os);
        }

        return devices;
    }

    getDevice(id) {
        const data = this.getData();
        return (data.devices || []).find(d => d.id === id);
    }

    enrollDevice(device) {
        const data = this.getData();
        if (!data.devices) data.devices = [];

        device.id = 'DEV' + String(data.devices.length + 1).padStart(3, '0');
        device.status = 'pending';
        device.enrolledDate = new Date().toISOString().split('T')[0];
        device.lastSeen = new Date().toISOString();
        device.apps = [];
        device.battery = 100;
        device.storage = { used: 0, total: 128 };
        device.location = null;

        data.devices.push(device);
        this.saveData(data);

        this.addActivity({
            action: 'Device Enrolled',
            device: device.name,
            user: 'Admin',
            timestamp: new Date().toISOString()
        });

        return device;
    }

    updateDevice(id, updates) {
        const data = this.getData();
        const index = data.devices.findIndex(d => d.id === id);
        
        if (index !== -1) {
            data.devices[index] = { ...data.devices[index], ...updates };
            this.saveData(data);
            return data.devices[index];
        }
        return null;
    }

    lockDevice(id) {
        const device = this.updateDevice(id, { status: 'locked' });
        if (device) {
            this.addActivity({
                action: 'Device Locked',
                device: device.name,
                user: 'Admin',
                timestamp: new Date().toISOString()
            });

            this.addAlert({
                deviceId: id,
                deviceName: device.name,
                severity: 'high',
                type: 'security',
                message: 'Device has been remotely locked by administrator',
                timestamp: new Date().toISOString(),
                acknowledged: false
            });
        }
        return device;
    }

    unlockDevice(id) {
        const device = this.updateDevice(id, { status: 'active' });
        if (device) {
            this.addActivity({
                action: 'Device Unlocked',
                device: device.name,
                user: 'Admin',
                timestamp: new Date().toISOString()
            });
        }
        return device;
    }

    wipeDevice(id) {
        const device = this.updateDevice(id, { 
            status: 'wiped',
            apps: [],
            storage: { used: 0, total: device.storage?.total || 128 }
        });
        
        if (device) {
            this.addActivity({
                action: 'Device Wiped',
                device: device.name,
                user: 'Admin',
                timestamp: new Date().toISOString()
            });

            this.addAlert({
                deviceId: id,
                deviceName: device.name,
                severity: 'critical',
                type: 'security',
                message: 'Device has been remotely wiped',
                timestamp: new Date().toISOString(),
                acknowledged: false
            });
        }
        return device;
    }

    unenrollDevice(id) {
        const data = this.getData();
        const device = data.devices.find(d => d.id === id);
        data.devices = data.devices.filter(d => d.id !== id);
        this.saveData(data);

        if (device) {
            this.addActivity({
                action: 'Device Unenrolled',
                device: device.name,
                user: 'Admin',
                timestamp: new Date().toISOString()
            });
        }
    }

    // Policies
    getPolicies() {
        const data = this.getData();
        return data.policies || [];
    }

    addPolicy(policy) {
        const data = this.getData();
        if (!data.policies) data.policies = [];
        
        policy.id = 'POL' + String(data.policies.length + 1).padStart(3, '0');
        policy.createdDate = new Date().toISOString().split('T')[0];
        data.policies.push(policy);
        this.saveData(data);

        this.addActivity({
            action: 'Policy Created',
            device: 'All Devices',
            user: 'Admin',
            timestamp: new Date().toISOString()
        });

        return policy;
    }

    // App Rules
    getAppRules() {
        const data = this.getData();
        return data.appRules || [];
    }

    addAppRule(rule) {
        const data = this.getData();
        if (!data.appRules) data.appRules = [];
        
        rule.id = 'APP' + String(data.appRules.length + 1).padStart(3, '0');
        data.appRules.push(rule);
        this.saveData(data);

        this.addActivity({
            action: `App ${rule.action === 'block' ? 'Blocked' : rule.action === 'allow' ? 'Allowed' : 'Monitored'}`,
            device: 'Selected Devices',
            user: 'Admin',
            timestamp: new Date().toISOString()
        });

        return rule;
    }

    removeAppRule(id) {
        const data = this.getData();
        data.appRules = (data.appRules || []).filter(r => r.id !== id);
        this.saveData(data);
    }

    // Alerts
    getAlerts(filters = {}) {
        const data = this.getData();
        let alerts = data.alerts || [];

        if (filters.severity) {
            alerts = alerts.filter(a => a.severity === filters.severity);
        }

        if (filters.type) {
            alerts = alerts.filter(a => a.type === filters.type);
        }

        return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    addAlert(alert) {
        const data = this.getData();
        if (!data.alerts) data.alerts = [];
        
        alert.id = 'ALR' + String(data.alerts.length + 1).padStart(3, '0');
        data.alerts.unshift(alert);
        // Keep only last 100 alerts
        data.alerts = data.alerts.slice(0, 100);
        this.saveData(data);
    }

    acknowledgeAlert(id) {
        const data = this.getData();
        const alert = (data.alerts || []).find(a => a.id === id);
        if (alert) {
            alert.acknowledged = true;
            this.saveData(data);
        }
    }

    // Activities
    getActivities(limit = 10) {
        const data = this.getData();
        return (data.activities || []).slice(0, limit);
    }

    addActivity(activity) {
        const data = this.getData();
        if (!data.activities) data.activities = [];
        data.activities.unshift(activity);
        // Keep only last 50 activities
        data.activities = data.activities.slice(0, 50);
        this.saveData(data);
    }

    // Statistics
    getStatistics() {
        const data = this.getData();
        const devices = data.devices || [];
        const alerts = data.alerts || [];

        return {
            totalDevices: devices.length,
            activeDevices: devices.filter(d => d.status === 'active').length,
            lockedDevices: devices.filter(d => d.status === 'locked').length,
            alertCount: alerts.filter(a => !a.acknowledged).length
        };
    }
}

const mdmData = new MDMDataManager();
