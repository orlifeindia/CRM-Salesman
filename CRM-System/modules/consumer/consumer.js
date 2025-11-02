// ========== CONSUMER MODULE JAVASCRIPT ==========

let customers = [];
let editMode = false;
let editId = null;


// ========== PAGE LOAD ==========
window.addEventListener('DOMContentLoaded', function() {
    loadCustomers();
    setupEventListeners();
});

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    document.getElementById('customer-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveCustomer();
    });

    const searchBox = document.getElementById('search-box');
    if (searchBox) {
        searchBox.addEventListener('keyup', searchCustomers);
    }
}

// ========== LOAD CUSTOMERS ==========
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        customers = await response.json();
        renderCustomersTable();
        updateSummary();
        
    } catch (error) {
        console.error('Error loading customers:', error);
        alert('Failed to load customers');
    }
}

// ========== RENDER CUSTOMERS TABLE ==========
function renderCustomersTable() {
    const tbody = document.querySelector('#customers-table tbody');
    tbody.innerHTML = '';

    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#999; padding:20px;">No customers found</td></tr>';
        return;
    }

    customers.forEach((customer, index) => {
        const row = `
            <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="text-align: center;">${index + 1}</td>
                <td><strong>${customer.name}</strong></td>
                <td>${customer.mobile}</td>
                <td>${customer.email || '-'}</td>
                <td>${customer.city || '-'}</td>
                <td>${customer.district || '-'}</td>
                <td>${customer.state || '-'}</td>
                <td>${customer.pincode || '-'}</td>
                <td style="white-space: nowrap;">
                    <button onclick="viewCustomer(${customer.id})" style="background: #17a2b8; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">👁️ View</button>
                    <button onclick="editCustomer(${customer.id})" style="background: #ffc107; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Edit</button>
                    <button onclick="deleteCustomer(${customer.id})" style="background: #dc3545; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">🗑️ Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// ========== VIEW CUSTOMER ==========
window.viewCustomer = function(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) {
        alert('❌ Customer not found!');
        return;
    }

    const details = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CUSTOMER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 Name: ${customer.name}
📱 Mobile: ${customer.mobile}
📧 Email: ${customer.email || 'N/A'}

📍 ADDRESS:
${customer.address || 'N/A'}
🏙️ City: ${customer.city || 'N/A'}
🏘️ District: ${customer.district || 'N/A'}
🗺️ State: ${customer.state || 'N/A'}
📮 Pincode: ${customer.pincode || 'N/A'}

📦 BUSINESS INFO:
🏷️ Distributor Code: ${customer.distributor_code || 'N/A'}
📄 Docket No: ${customer.docket_no || 'N/A'}

🚚 SHIPPING DETAILS:
${customer.shipping_details || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    alert(details);
}

// ========== UPDATE SUMMARY ==========
function updateSummary() {
    const summaryDiv = document.getElementById('summary');
    if (summaryDiv) {
        summaryDiv.textContent = `📊 Total Customers: ${customers.length}`;
    }
}

// ========== SAVE CUSTOMER ==========
async function saveCustomer() {
    const customerData = {
        name: document.getElementById('name').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        district: document.getElementById('district').value.trim(),
        state: document.getElementById('state').value.trim(),
        pincode: document.getElementById('pincode').value.trim(),
        distributor_code: document.getElementById('distributor-code').value.trim(),
        docket_no: document.getElementById('docket-no').value.trim(),
        shipping_details: document.getElementById('shipping-details').value.trim(),
        status: 'Active'
    };

    // Validation
    if (!customerData.name || !customerData.mobile || !customerData.email) {
        alert('❌ Name, Mobile, and Email are required!');
        return;
    }

    if (!/^[0-9]{10}$/.test(customerData.mobile)) {
        alert('❌ Please enter valid 10 digit mobile number');
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerData.email)) {
        alert('❌ Please enter valid email');
        return;
    }

    try {
        let response;

        if (editMode && editId) {
            response = await fetch(`${API_BASE}/customers/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            
            if (!response.ok) throw new Error('Failed to update');
            alert('✅ Customer updated successfully!');
        } else {
            response = await fetch(`${API_BASE}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            
            if (!response.ok) throw new Error('Failed to add');
            alert('✅ Customer added successfully!');
        }

        clearForm();
        await loadCustomers();

    } catch (error) {
        console.error('Error saving customer:', error);
        alert('❌ Failed to save customer: ' + error.message);
    }
}

// ========== CLEAR FORM ==========
window.clearForm = function() {
    document.getElementById('customer-form').reset();
    editMode = false;
    editId = null;
    document.getElementById('submit-btn').textContent = 'Add Customer';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== EDIT CUSTOMER ==========
window.editCustomer = function(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) {
        alert('❌ Customer not found!');
        return;
    }

    document.getElementById('name').value = customer.name;
    document.getElementById('mobile').value = customer.mobile;
    document.getElementById('email').value = customer.email || '';
    document.getElementById('address').value = customer.address || '';
    document.getElementById('city').value = customer.city || '';
    document.getElementById('district').value = customer.district || '';
    document.getElementById('state').value = customer.state || '';
    document.getElementById('pincode').value = customer.pincode || '';
    document.getElementById('distributor-code').value = customer.distributor_code || '';
    document.getElementById('docket-no').value = customer.docket_no || '';
    document.getElementById('shipping-details').value = customer.shipping_details || '';

    editMode = true;
    editId = id;
    document.getElementById('submit-btn').textContent = 'Update Customer';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== DELETE CUSTOMER ==========
window.deleteCustomer = async function(id) {
    if (!confirm('⚠️ Are you sure you want to delete this customer?\n\nThis action cannot be undone!')) return;

    try {
        const response = await fetch(`${API_BASE}/customers/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete');

        alert('✅ Customer deleted successfully!');
        await loadCustomers();

    } catch (error) {
        console.error('Error deleting customer:', error);
        alert('❌ Failed to delete customer: ' + error.message);
    }
}

// ========== SEARCH CUSTOMERS ==========
function searchCustomers() {
    const query = document.getElementById('search-box').value.toLowerCase();

    if (!query) {
        renderCustomersTable();
        updateSummary();
        return;
    }

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.mobile.includes(query) ||
        (c.email && c.email.toLowerCase().includes(query)) ||
        (c.city && c.city.toLowerCase().includes(query)) ||
        (c.state && c.state.toLowerCase().includes(query)) ||
        (c.district && c.district.toLowerCase().includes(query)) ||
        (c.pincode && c.pincode.includes(query)) ||
        (c.distributor_code && c.distributor_code.toLowerCase().includes(query))
    );

    const tbody = document.querySelector('#customers-table tbody');
    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#dc3545; padding: 20px;">❌ No results found</td></tr>';
        document.getElementById('summary').textContent = `📊 Showing 0 of ${customers.length} customers`;
        return;
    }

    filtered.forEach((customer, index) => {
        const row = `
            <tr style="border-bottom: 1px solid #e9ecef;">
                <td style="text-align: center;">${index + 1}</td>
                <td><strong>${customer.name}</strong></td>
                <td>${customer.mobile}</td>
                <td>${customer.email || '-'}</td>
                <td>${customer.city || '-'}</td>
                <td>${customer.district || '-'}</td>
                <td>${customer.state || '-'}</td>
                <td>${customer.pincode || '-'}</td>
                <td style="white-space: nowrap;">
                    <button onclick="viewCustomer(${customer.id})" style="background: #17a2b8; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">👁️ View</button>
                    <button onclick="editCustomer(${customer.id})" style="background: #ffc107; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Edit</button>
                    <button onclick="deleteCustomer(${customer.id})" style="background: #dc3545; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer;">🗑️ Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById('summary').textContent = `📊 Showing ${filtered.length} of ${customers.length} customers`;
}

// ========== EXPORT TO CSV ==========
window.exportCustomersToCSV = function() {
    if (customers.length === 0) {
        alert('❌ No customers to export!');
        return;
    }

    let csv = 'S.No,Name,Mobile,Email,Address,City,District,State,Pincode,Distributor Code,Docket No,Status\n';
    
    customers.forEach((cust, idx) => {
        csv += `${idx + 1},"${cust.name}","${cust.mobile}","${cust.email || ''}","${(cust.address || '').replace(/"/g, '""')}","${cust.city || ''}","${cust.district || ''}","${cust.state || ''}","${cust.pincode || ''}","${cust.distributor_code || ''}","${cust.docket_no || ''}","${cust.status || 'Active'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ CSV exported successfully!');
}
// Protect all modules from direct access without login
const loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
  // Not logged in, redirect to login page!
  window.location.href = '/modules/login/login.html';
} else {
  // Optional: Show user info, e.g. greeting
  // const userObj = JSON.parse(loggedInUser);
  // document.getElementById('header-user').innerText = 'Welcome, ' + userObj.username;
}
