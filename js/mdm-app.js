// MDM Application - Main Entry Point
// This file handles initialization and global configurations

console.log('%c Mobile Device Management System ', 'background: #3b82f6; color: white; font-size: 16px; padding: 10px;');
console.log('System initialized successfully');

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Prevent accidental page close with unsaved changes
window.addEventListener('beforeunload', (e) => {
    const modals = document.querySelectorAll('.modal');
    const hasOpenModal = Array.from(modals).some(m => m.style.display === 'block');
    if (hasOpenModal) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape: Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
        });
    }
});

// Export/Import functions for debugging
window.exportMDMData = () => {
    const data = mdmData.getData();
    console.log('Exported data:', data);
    return JSON.stringify(data, null, 2);
};

window.importMDMData = (jsonString) => {
    try {
        const data = JSON.parse(jsonString);
        mdmData.saveData(data);
        mdmUI.showToast('Data imported successfully', 'success');
        mdmUI.navigateTo(mdmUI.currentPage);
        return true;
    } catch (error) {
        mdmUI.showToast('Import failed', 'error');
        return false;
    }
};

window.clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
};

// Simulate device updates (optional - for demonstration)
function simulateDeviceUpdates() {
    setInterval(() => {
        const devices = mdmData.getDevices();
        if (devices.length > 0) {
            // Randomly update a device
            const device = devices[Math.floor(Math.random() * devices.length)];
            device.lastSeen = new Date().toISOString();
            device.battery = Math.max(0, Math.min(100, device.battery + (Math.random() - 0.5) * 10));
            mdmData.updateDevice(device.id, device);
            
            // Update UI if on dashboard or devices page
            if (mdmUI.currentPage === 'dashboard') {
                mdmUI.renderDashboard();
            } else if (mdmUI.currentPage === 'devices') {
                mdmUI.renderDevices();
            }
        }
    }, 30000); // Update every 30 seconds
}

// Uncomment to enable simulation
// simulateDeviceUpdates();
