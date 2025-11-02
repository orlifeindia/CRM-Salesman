// shared/utils.js
// ========== Helper Functions ==========

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mobile Validation (10 digits)
function validateMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

// Pincode Validation (6 digits)
function validatePincode(pincode) {
    return /^[0-9]{6}$/.test(pincode);
}

// Date Formatting
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

// Get Today's Date in YYYY-MM-DD format
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Show Message (Success/Error)
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('message');
    
    if (!messageDiv) {
        alert(message);
        return;
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Export to CSV
function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }
    
    // Get headers
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${value}"`;
        });
        csv += values.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Format Currency (Indian Rupees)
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
}

// Calculate GST
function calculateGST(amount, gstPercent) {
    const gst = (amount * gstPercent) / 100;
    return {
        gstAmount: gst,
        totalAmount: amount + gst
    };
}
