// ============================================
// CRM Reports Module - JavaScript
// ============================================

// API Base URL
const API_URL = 'http://localhost:3001/api';

// ============================================
// TAB SWITCHING FUNCTION
// ============================================
function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data for the selected tab
    if (tabName === 'customer') {
        loadCustomerReports();
    } else if (tabName === 'lead') {
        loadLeadReports();
    } else if (tabName === 'order') {
        loadOrderReports();
    }
}

// ============================================
// CUSTOMER REPORTS
// ============================================
async function loadCustomerReports() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        
        const customers = await response.json();
        
        // Total Customers
        document.getElementById('total-customers').textContent = customers.length;
        
        // Active Customers
        const activeCustomers = customers.filter(c => c.status === 'Active' || c.status === 'active').length;
        document.getElementById('active-customers').textContent = activeCustomers;
        
        // This Month Customers
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const monthCustomers = customers.filter(c => {
            if (!c.created_at) return false;
            const createdDate = new Date(c.created_at);
            return createdDate.getMonth() === thisMonth && createdDate.getFullYear() === thisYear;
        }).length;
        document.getElementById('month-customers').textContent = monthCustomers;
        
        // City-wise Distribution
        const cityCount = {};
        customers.forEach(c => {
            const city = c.city && c.city.trim() !== '' ? c.city : 'Not Specified';
            cityCount[city] = (cityCount[city] || 0) + 1;
        });
        
        const cityTableBody = document.querySelector('#city-table tbody');
        cityTableBody.innerHTML = '';
        
        if (Object.keys(cityCount).length === 0) {
            cityTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 30px; color: #95a5a6;">No data available</td></tr>';
        } else {
            Object.entries(cityCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(([city, count]) => {
                    const percentage = ((count / customers.length) * 100).toFixed(1);
                    const row = `
                        <tr>
                            <td><strong>${city}</strong></td>
                            <td>${count}</td>
                            <td>${percentage}%</td>
                        </tr>
                    `;
                    cityTableBody.innerHTML += row;
                });
        }
        
        // State-wise Distribution
        const stateCount = {};
        customers.forEach(c => {
            const state = c.state && c.state.trim() !== '' ? c.state : 'Not Specified';
            stateCount[state] = (stateCount[state] || 0) + 1;
        });
        
        const stateTableBody = document.querySelector('#state-table tbody');
        stateTableBody.innerHTML = '';
        
        if (Object.keys(stateCount).length === 0) {
            stateTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 30px; color: #95a5a6;">No data available</td></tr>';
        } else {
            Object.entries(stateCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(([state, count]) => {
                    const percentage = ((count / customers.length) * 100).toFixed(1);
                    const row = `
                        <tr>
                            <td><strong>${state}</strong></td>
                            <td>${count}</td>
                            <td>${percentage}%</td>
                        </tr>
                    `;
                    stateTableBody.innerHTML += row;
                });
        }
            
    } catch (error) {
        console.error('Error loading customer reports:', error);
        alert('Error loading customer reports');
    }
}

// ============================================
// LEAD REPORTS
// ============================================
async function loadLeadReports() {
    try {
        const response = await fetch(`${API_URL}/leads`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch leads');
        }
        
        const leads = await response.json();
        
        document.getElementById('total-leads').textContent = leads.length;
        
        const statusCount = {
            'New': 0,
            'Contacted': 0,
            'In Progress': 0,
            'Converted': 0,
            'Lost': 0
        };
        
        leads.forEach(lead => {
            if (statusCount.hasOwnProperty(lead.status)) {
                statusCount[lead.status]++;
            }
        });
        
        document.getElementById('converted-leads').textContent = statusCount['Converted'];
        document.getElementById('progress-leads').textContent = statusCount['In Progress'];
        document.getElementById('lost-leads').textContent = statusCount['Lost'];
        
        const conversionRate = leads.length > 0 
            ? ((statusCount['Converted'] / leads.length) * 100).toFixed(1) 
            : 0;
        document.getElementById('conversion-rate').textContent = conversionRate + '%';
        
        const statusTableBody = document.querySelector('#lead-status-table tbody');
        statusTableBody.innerHTML = '';
        
        Object.entries(statusCount).forEach(([status, count]) => {
            const percentage = leads.length > 0 
                ? ((count / leads.length) * 100).toFixed(1) 
                : 0;
            
            let statusBadge = '';
            switch(status) {
                case 'New': statusBadge = '🆕'; break;
                case 'Contacted': statusBadge = '📞'; break;
                case 'In Progress': statusBadge = '⏳'; break;
                case 'Converted': statusBadge = '✅'; break;
                case 'Lost': statusBadge = '❌'; break;
            }
            
            const row = `
                <tr>
                    <td><strong>${statusBadge} ${status}</strong></td>
                    <td>${count}</td>
                    <td>${percentage}%</td>
                </tr>
            `;
            statusTableBody.innerHTML += row;
        });
        
    } catch (error) {
        console.error('Error loading lead reports:', error);
        alert('Error loading lead reports');
    }
}

// ============================================
// ORDER REPORTS
// ============================================
async function loadOrderReports() {
    try {
        const response = await fetch(`${API_URL}/orders`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }
        
        const orders = await response.json();
        
        document.getElementById('total-orders').textContent = orders.length;
        
        let totalItems = 0;
        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                totalItems += order.items.length;
            }
        });
        document.getElementById('total-items').textContent = totalItems;
        
        let totalRevenue = 0;
        orders.forEach(order => {
            totalRevenue += parseFloat(order.grand_total || 0);
        });
        document.getElementById('total-revenue').textContent = '₹' + totalRevenue.toFixed(2);
        
        const partyCount = {};
        const partyItems = {};
        
        orders.forEach(order => {
            const party = order.party_name || 'Unknown Party';
            partyCount[party] = (partyCount[party] || 0) + 1;
            
            if (order.items && Array.isArray(order.items)) {
                partyItems[party] = (partyItems[party] || 0) + order.items.length;
            }
        });
        
        const partyTableBody = document.querySelector('#party-table tbody');
        if (partyTableBody) {
            partyTableBody.innerHTML = '';
            
            if (Object.keys(partyCount).length === 0) {
                partyTableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 30px;">No orders available</td></tr>';
            } else {
                Object.entries(partyCount)
                    .sort((a, b) => b[1] - a[1])
                    .forEach(([party, count]) => {
                        const items = partyItems[party] || 0;
                        const row = `
                            <tr>
                                <td><strong>${party}</strong></td>
                                <td>${count}</td>
                                <td>${items}</td>
                            </tr>
                        `;
                        partyTableBody.innerHTML += row;
                    });
            }
        }
        
    } catch (error) {
        console.error('Error loading order reports:', error);
        alert('Error loading order reports');
    }
}

// ============================================
// FILTER ORDERS BY DATE RANGE
// ============================================
async function filterOrders() {
    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    
    if (!fromDate || !toDate) {
        alert('कृपया दोनों dates select करें!');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders`);
        const allOrders = await response.json();
        
        const filteredOrders = allOrders.filter(order => {
            const orderDate = new Date(order.order_date);
            const from = new Date(fromDate);
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            
            return orderDate >= from && orderDate <= to;
        });
        
        document.getElementById('total-orders').textContent = filteredOrders.length;
        
        let totalItems = 0;
        let totalRevenue = 0;
        
        filteredOrders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                totalItems += order.items.length;
            }
            totalRevenue += parseFloat(order.grand_total || 0);
        });
        
        document.getElementById('total-items').textContent = totalItems;
        document.getElementById('total-revenue').textContent = '₹' + totalRevenue.toFixed(2);
        
        alert('Filtered: ' + filteredOrders.length + ' orders');
        
    } catch (error) {
        console.error('Error filtering orders:', error);
        alert('Error filtering orders');
    }
}

// ============================================
// EXPORT TO PDF
// ============================================
function exportPDF() {
    alert('PDF Export feature coming soon!');
}

// ============================================
// EXPORT TO EXCEL (CSV)
// ============================================
function exportExcel() {
    const activeTab = document.querySelector('.tab-content.active');
    const tables = activeTab.querySelectorAll('table');
    
    if (tables.length === 0) {
        alert('No data to export');
        return;
    }
    
    let csv = '';
    
    tables.forEach((table, index) => {
        const heading = activeTab.querySelectorAll('h3')[index];
        if (heading) {
            csv += heading.textContent + '\n\n';
        }
        
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('th, td');
            const rowData = Array.from(cols).map(col => col.textContent.trim());
            csv += rowData.join(',') + '\n';
        });
        
        csv += '\n\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report_' + Date.now() + '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Report exported successfully!');
}

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const fromDateEl = document.getElementById('from-date');
    const toDateEl = document.getElementById('to-date');
    
    if (fromDateEl && toDateEl) {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        fromDateEl.valueAsDate = firstDay;
        toDateEl.valueAsDate = today;
    }
    
    loadCustomerReports();
});
