// Mobile Device Management - UI Manager and Main App

class MDMUIManager {
    constructor(dataManager) {
        this.dataManager = dataManager;
        this.currentPage = 'dashboard';
        this.currentDeviceId = null;
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.renderDashboard();
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });
    }

    navigateTo(page) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`).classList.add('active');
        this.currentPage = page;

        switch (page) {
            case 'dashboard': this.renderDashboard(); break;
            case 'devices': this.renderDevices(); break;
            case 'policies': this.renderPolicies(); break;
            case 'app-control': this.renderAppControl(); break;
            case 'alerts': this.renderAlerts(); break;
        }
    }

    setupEventListeners() {
        // Enroll Device
        document.getElementById('enroll-device-btn').addEventListener('click', () => this.openEnrollModal());
        document.querySelector('#enroll-device-modal .close').addEventListener('click', () => this.closeModal('enroll-device-modal'));
        document.querySelectorAll('.cancel-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });
        document.getElementById('enroll-device-form').addEventListener('submit', (e) => this.handleEnrollDevice(e));

        // Device filters
        document.getElementById('search-devices').addEventListener('input', () => this.renderDevices());
        document.getElementById('status-filter').addEventListener('change', () => this.renderDevices());
        document.getElementById('os-filter').addEventListener('change', () => this.renderDevices());

        // Device Details
        document.querySelector('#device-details-modal .close').addEventListener('click', () => this.closeModal('device-details-modal'));
        
        // Policies
        document.getElementById('create-policy-btn').addEventListener('click', () => this.openPolicyModal());
        document.querySelector('#policy-modal .close').addEventListener('click', () => this.closeModal('policy-modal'));
        document.getElementById('policy-form').addEventListener('submit', (e) => this.handleCreatePolicy(e));

        // App Control
        document.getElementById('add-app-rule-btn').addEventListener('click', () => this.openAppRuleModal());
        document.querySelector('#app-rule-modal .close').addEventListener('click', () => this.closeModal('app-rule-modal'));
        document.getElementById('app-rule-form').addEventListener('submit', (e) => this.handleAddAppRule(e));

        // Alert filters
        document.getElementById('alert-severity-filter').addEventListener('change', () => this.renderAlerts());
        document.getElementById('alert-type-filter').addEventListener('change', () => this.renderAlerts());

        // Confirmation dialog
        document.getElementById('confirm-no').addEventListener('click', () => this.closeModal('confirm-dialog'));
    }

    // Dashboard
    renderDashboard() {
        const stats = this.dataManager.getStatistics();
        document.getElementById('total-devices').textContent = stats.totalDevices;
        document.getElementById('active-devices').textContent = stats.activeDevices;
        document.getElementById('locked-devices').textContent = stats.lockedDevices;
        document.getElementById('alert-count').textContent = stats.alertCount;
        this.renderActivities();
    }

    renderActivities() {
        const activities = this.dataManager.getActivities(10);
        document.getElementById('activity-list').innerHTML = activities.map(activity => `
            <div class="activity-item">
                <strong>${activity.action}</strong>: ${activity.device}
                <div class="time">${this.formatTimeAgo(activity.timestamp)} by ${activity.user}</div>
            </div>
        `).join('');
    }

    // Devices
    renderDevices() {
        const filters = {
            search: document.getElementById('search-devices').value,
            status: document.getElementById('status-filter').value,
            os: document.getElementById('os-filter').value
        };

        const devices = this.dataManager.getDevices(filters);
        document.getElementById('devices-grid').innerHTML = devices.map(device => `
            <div class="device-card" onclick="mdmUI.showDeviceDetails('${device.id}')">
                <div class="device-header">
                    <div class="device-icon">
                        <i class="fas fa-${device.os === 'iOS' ? 'apple' : 'android'}"></i>
                    </div>
                    <span class="device-status ${device.status}">${device.status}</span>
                </div>
                <div class="device-info">
                    <h3>${device.name}</h3>
                    <div class="device-details">
                        <div><strong>IMEI:</strong> ${device.imei}</div>
                        <div><strong>Model:</strong> ${device.model}</div>
                        <div><strong>OS:</strong> ${device.os} ${device.osVersion || ''}</div>
                        <div><strong>Owner:</strong> ${device.owner}</div>
                        <div><strong>Battery:</strong> ${device.battery}%</div>
                        <div><strong>Last Seen:</strong> ${this.formatTimeAgo(device.lastSeen)}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showDeviceDetails(deviceId) {
        const device = this.dataManager.getDevice(deviceId);
        if (!device) return;

        this.currentDeviceId = deviceId;
        document.getElementById('device-details-title').textContent = device.name;
        document.getElementById('device-details-content').innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                <div><strong>IMEI:</strong> ${device.imei}</div>
                <div><strong>Model:</strong> ${device.model}</div>
                <div><strong>OS:</strong> ${device.os} ${device.osVersion || ''}</div>
                <div><strong>Status:</strong> <span class="device-status ${device.status}">${device.status}</span></div>
                <div><strong>Owner:</strong> ${device.owner}</div>
                <div><strong>Phone:</strong> ${device.phone}</div>
                <div><strong>Email:</strong> ${device.email}</div>
                <div><strong>Enrolled:</strong> ${device.enrolledDate}</div>
                <div><strong>Battery:</strong> ${device.battery}%</div>
                <div><strong>Storage:</strong> ${device.storage.used}GB / ${device.storage.total}GB</div>
                <div><strong>Last Seen:</strong> ${this.formatTimeAgo(device.lastSeen)}</div>
                <div><strong>Location:</strong> ${device.location?.address || 'Unknown'}</div>
            </div>
            <div><strong>Installed Apps:</strong> ${device.apps?.length || 0} apps</div>
        `;

        // Setup action buttons
        document.getElementById('lock-device-btn').onclick = () => this.confirmAction('Lock Device', `Are you sure you want to lock ${device.name}?`, () => this.lockDevice(deviceId));
        document.getElementById('locate-device-btn').onclick = () => this.locateDevice(deviceId);
        document.getElementById('wipe-device-btn').onclick = () => this.confirmAction('Wipe Device', `WARNING: This will erase all data on ${device.name}. This cannot be undone!`, () => this.wipeDevice(deviceId));
        document.getElementById('unenroll-device-btn').onclick = () => this.confirmAction('Unenroll Device', `Remove ${device.name} from management?`, () => this.unenrollDevice(deviceId));

        this.openModal('device-details-modal');
    }

    lockDevice(deviceId) {
        if (this.dataManager.lockDevice(deviceId)) {
            this.showToast('Device locked successfully', 'success');
            this.closeModal('device-details-modal');
            this.renderDevices();
            if (this.currentPage === 'dashboard') this.renderDashboard();
        }
    }

    locateDevice(deviceId) {
        const device = this.dataManager.getDevice(deviceId);
        if (device?.location) {
            alert(`Device Location:\n${device.location.address}\nLat: ${device.location.lat}, Lng: ${device.location.lng}`);
        } else {
            this.showToast('Location not available', 'warning');
        }
    }

    wipeDevice(deviceId) {
        if (this.dataManager.wipeDevice(deviceId)) {
            this.showToast('Device wiped successfully', 'success');
            this.closeModal('device-details-modal');
            this.renderDevices();
            if (this.currentPage === 'dashboard') this.renderDashboard();
        }
    }

    unenrollDevice(deviceId) {
        this.dataManager.unenrollDevice(deviceId);
        this.showToast('Device unenrolled', 'success');
        this.closeModal('device-details-modal');
        this.renderDevices();
        if (this.currentPage === 'dashboard') this.renderDashboard();
    }

    // Enroll Device
    openEnrollModal() {
        document.getElementById('enroll-device-form').reset();
        this.openModal('enroll-device-modal');
    }

    handleEnrollDevice(e) {
        e.preventDefault();
        const device = {
            name: document.getElementById('device-name').value,
            imei: document.getElementById('device-imei').value,
            model: document.getElementById('device-model').value,
            os: document.getElementById('device-os').value,
            owner: document.getElementById('device-owner').value,
            phone: document.getElementById('device-phone').value,
            email: document.getElementById('device-email').value
        };

        this.dataManager.enrollDevice(device);
        this.showToast('Device enrolled successfully', 'success');
        this.closeModal('enroll-device-modal');
        this.renderDevices();
        if (this.currentPage === 'dashboard') this.renderDashboard();
    }

    // Policies
    renderPolicies() {
        const policies = this.dataManager.getPolicies();
        const security = policies.filter(p => p.type === 'security');
        const network = policies.filter(p => p.type === 'network');
        const restrictions = policies.filter(p => p.type === 'restriction');

        document.getElementById('security-policies').innerHTML = this.renderPolicyList(security);
        document.getElementById('network-policies').innerHTML = this.renderPolicyList(network);
        document.getElementById('device-restrictions').innerHTML = this.renderPolicyList(restrictions);
    }

    renderPolicyList(policies) {
        return policies.map(policy => `
            <div class="policy-item">
                <h4>${policy.name}</h4>
                <p>${policy.description}</p>
                <div class="policy-toggle">
                    <input type="checkbox" ${policy.enforced ? 'checked' : ''} disabled>
                    <span>${policy.enforced ? 'Enforced' : 'Not Enforced'}</span>
                </div>
            </div>
        `).join('') || '<p>No policies defined</p>';
    }

    openPolicyModal() {
        document.getElementById('policy-form').reset();
        this.openModal('policy-modal');
    }

    handleCreatePolicy(e) {
        e.preventDefault();
        const policy = {
            name: document.getElementById('policy-name').value,
            type: document.getElementById('policy-type').value,
            description: document.getElementById('policy-description').value,
            enforced: document.getElementById('policy-enforce').checked
        };

        this.dataManager.addPolicy(policy);
        this.showToast('Policy created successfully', 'success');
        this.closeModal('policy-modal');
        this.renderPolicies();
    }

    // App Control
    renderAppControl() {
        const rules = this.dataManager.getAppRules();
        const blocked = rules.filter(r => r.action === 'block');
        const allowed = rules.filter(r => r.action === 'allow');
        const monitored = rules.filter(r => r.action === 'monitor');

        document.getElementById('blocked-apps').innerHTML = this.renderAppList(blocked);
        document.getElementById('allowed-apps').innerHTML = this.renderAppList(allowed);
        document.getElementById('monitored-apps').innerHTML = this.renderAppList(monitored);
    }

    renderAppList(apps) {
        return apps.map(app => `
            <div class="app-item">
                <div class="app-info">
                    <div class="app-icon"><i class="fas fa-mobile-alt"></i></div>
                    <div>
                        <div class="app-name">${app.name}</div>
                        <div class="app-package">${app.packageName}</div>
                    </div>
                </div>
                <button class="app-remove" onclick="mdmUI.removeApp('${app.id}')"><i class="fas fa-times"></i></button>
            </div>
        `).join('') || '<p>No apps in this category</p>';
    }

    removeApp(appId) {
        this.dataManager.removeAppRule(appId);
        this.showToast('App rule removed', 'success');
        this.renderAppControl();
    }

    openAppRuleModal() {
        document.getElementById('app-rule-form').reset();
        const devices = this.dataManager.getDevices();
        document.getElementById('app-devices').innerHTML = devices.map(d => 
            `<option value="${d.id}">${d.name}</option>`
        ).join('');
        this.openModal('app-rule-modal');
    }

    handleAddAppRule(e) {
        e.preventDefault();
        const rule = {
            name: document.getElementById('app-name').value,
            packageName: document.getElementById('app-package').value,
            action: document.getElementById('app-action').value,
            devices: Array.from(document.getElementById('app-devices').selectedOptions).map(o => o.value),
            reason: 'Administrative action'
        };

        this.dataManager.addAppRule(rule);
        this.showToast('App rule added successfully', 'success');
        this.closeModal('app-rule-modal');
        this.renderAppControl();
    }

    // Alerts
    renderAlerts() {
        const filters = {
            severity: document.getElementById('alert-severity-filter').value,
            type: document.getElementById('alert-type-filter').value
        };

        const alerts = this.dataManager.getAlerts(filters);
        document.getElementById('alerts-list').innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.severity} ${alert.acknowledged ? 'acknowledged' : ''}">
                <div class="alert-header">
                    <div>
                        <h3>${alert.deviceName}</h3>
                        <span class="alert-severity ${alert.severity}">${alert.severity}</span>
                    </div>
                    <div class="alert-time">${this.formatTimeAgo(alert.timestamp)}</div>
                </div>
                <p>${alert.message}</p>
                ${!alert.acknowledged ? `<button class="btn btn-primary" onclick="mdmUI.acknowledgeAlert('${alert.id}')">Acknowledge</button>` : ''}
            </div>
        `).join('') || '<p>No alerts found</p>';
    }

    acknowledgeAlert(alertId) {
        this.dataManager.acknowledgeAlert(alertId);
        this.showToast('Alert acknowledged', 'success');
        this.renderAlerts();
        if (this.currentPage === 'dashboard') this.renderDashboard();
    }

    // Utilities
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        this.closeModal('confirm-dialog');
    }

    confirmAction(title, message, onConfirm) {
        document.getElementById('confirm-title').textContent = title;
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-yes').onclick = () => {
            onConfirm();
            this.closeModal('confirm-dialog');
        };
        this.openModal('confirm-dialog');
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diff = Math.floor((now - time) / 1000);
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        return `${Math.floor(diff / 86400)} days ago`;
    }
}

// Initialize
const mdmUI = new MDMUIManager(mdmData);
document.addEventListener('DOMContentLoaded', () => {
    mdmUI.init();
    mdmUI.showToast('MDM System Ready', 'success');
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});
