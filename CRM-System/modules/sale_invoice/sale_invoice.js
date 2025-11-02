// ========== SALE INVOICE MODULE JAVASCRIPT ==========

let invoiceItems = [];
let customers = [];
let grandTotal = 0;

// ========== PG POOL ==========


// ========== PAGE LOAD ==========
window.addEventListener('DOMContentLoaded', function() {
  loadCustomersForDropdown();
  setupInvoiceEventListeners();
  setTodayDate();
});

// ========== SET TODAY'S DATE ==========
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('invoice-date').value = today;
}

// ========== LOAD CUSTOMERS FOR PARTY DROPDOWN ==========
async function loadCustomersForDropdown() {
  try {
    const response = await fetch(`${API_BASE}/customers`);
    customers = await response.json();
    
    const partySelect = document.getElementById('party-select');
    partySelect.innerHTML = '<option value="">-- Select Party --</option>';
    
    customers.forEach(customer => {
      const option = document.createElement('option');
      option.value = customer.id;
      option.textContent = `${customer.name} (${customer.mobile})`;
      partySelect.appendChild(option);
    });
    // Add "Add New Party"
    const addNewOption = document.createElement('option');
    addNewOption.value = 'add-new';
    addNewOption.textContent = '+ Add New Party';
    partySelect.appendChild(addNewOption);
    
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// ========== EVENT LISTENERS ==========
function setupInvoiceEventListeners() {
  // Item form submit
  document.getElementById('invoice-item-form').addEventListener('submit', function(e) {
    e.preventDefault();
    addItemToInvoice();
  });
  
  // Submit invoice button
  document.getElementById('submit-invoice-btn').addEventListener('click', submitCompleteInvoice);
  
  // Party dropdown change
  document.getElementById('party-select').addEventListener('change', function(e) {
    if (e.target.value === 'add-new') {
      showPartyModal();
    }
  });
  
  // Quick add party form
  document.getElementById('quick-add-party-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveQuickParty();
  });
  
  // Cancel modal
  document.getElementById('cancel-add-party-btn').addEventListener('click', hidePartyModal);
  document.getElementById('modal-overlay').addEventListener('click', hidePartyModal);
}

// ========== ADD ITEM TO INVOICE ==========
function addItemToInvoice() {
  const description = document.getElementById('item-description').value.trim();
  const hsnCode = document.getElementById('item-hsn').value.trim();
  const qty = parseFloat(document.getElementById('item-qty').value);
  const unit = document.getElementById('item-unit').value.trim();
  const price = parseFloat(document.getElementById('item-price').value);
  const gstRate = parseFloat(document.getElementById('item-gst').value);
  
  if (!description || !qty || !price || isNaN(gstRate)) {
    alert('❌ Please fill all required fields!');
    return;
  }
  
  const baseAmount = qty * price;
  const gstAmount = (baseAmount * gstRate) / 100;
  const totalAmount = baseAmount + gstAmount;
  
  const item = {
    id: Date.now(),
    description,
    hsn_code: hsnCode,
    quantity: qty,
    unit,
    price,
    gst_rate: gstRate,
    gst_amount: gstAmount,
    amount: totalAmount
  };
  
  invoiceItems.push(item);
  renderInvoiceTable();
  document.getElementById('invoice-item-form').reset();
  document.getElementById('item-unit').value = 'Pcs';
  document.getElementById('item-gst').value = '18';
  document.getElementById('item-qty').value = '1';
}

// ========== RENDER INVOICE TABLE ==========
function renderInvoiceTable() {
  const tbody = document.querySelector('#invoice-table tbody');
  tbody.innerHTML = '';
  
  if (invoiceItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:#999; padding: 20px;">No items added yet</td></tr>';
    document.getElementById('grand-total').textContent = '₹0.00';
    return;
  }
  
  grandTotal = 0;
  
  invoiceItems.forEach((item, index) => {
    grandTotal += item.amount;
    const row = `
      <tr style="border-bottom: 1px solid #e9ecef;">
        <td style="text-align: center;">${index + 1}</td>
        <td>${item.description}</td>
        <td style="text-align: center;">${item.hsn_code || '-'}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: center;">${item.unit}</td>
        <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="text-align: center;">${item.gst_rate}%</td>
        <td style="text-align: right;">₹${item.gst_amount.toFixed(2)}</td>
        <td style="text-align: right; font-weight: bold;">₹${item.amount.toFixed(2)}</td>
        <td style="text-align: center;">
          <button onclick="removeInvoiceItem(${item.id})" style="background: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">🗑️ Remove</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
  
  document.getElementById('grand-total').textContent = `₹${grandTotal.toFixed(2)}`;
}

// ========== REMOVE ITEM ==========
window.removeInvoiceItem = function(itemId) {
  if (!confirm('Remove this item from invoice?')) return;
  invoiceItems = invoiceItems.filter(item => item.id !== itemId);
  renderInvoiceTable();
}

// ========== SUBMIT COMPLETE INVOICE ==========
async function submitCompleteInvoice() {
  const customerId = document.getElementById('party-select').value;
  const invoiceDate = document.getElementById('invoice-date').value;
  const invoiceNo = document.getElementById('invoice-no').value.trim();
  const narration = document.getElementById('narration').value.trim();
  
  if (!customerId || customerId === 'add-new') {
    alert('❌ Please select a party!');
    return;
  }
  if (!invoiceDate) {
    alert('❌ Please select invoice date!');
    return;
  }
  if (invoiceItems.length === 0) {
    alert('❌ Please add at least one item!');
    return;
  }
  
  const invoiceData = {
    customer_id: parseInt(customerId),
    invoice_date: invoiceDate,
    invoice_no: invoiceNo,
    narration: narration,
    total_amount: grandTotal,
    status: 'Pending',
    items: invoiceItems.map(item => ({
      description: item.description,
      hsn_code: item.hsn_code,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      gst_rate: item.gst_rate,
      gst_amount: item.gst_amount,
      amount: item.amount
    }))
  };
  
  try {
    const response = await fetch(`${API_BASE}/sale_invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoiceData)
    });
    if (!response.ok) throw new Error('Failed to save invoice');
    const result = await response.json();
    alert(`✅ Invoice created successfully!\nInvoice ID: ${result.id}\nTotal: ₹${grandTotal.toFixed(2)}`);
    resetInvoiceForm();
  } catch (error) {
    console.error('Error saving invoice:', error);
    alert('❌ Failed to save invoice: ' + error.message);
  }
}

// ========== RESET INVOICE FORM ==========
function resetInvoiceForm() {
  document.getElementById('party-select').value = '';
  document.getElementById('invoice-no').value = '';
  document.getElementById('narration').value = '';
  setTodayDate();
  invoiceItems = [];
  renderInvoiceTable();
}

// ========== SHOW/HIDE PARTY MODAL ==========
function showPartyModal() {
  document.getElementById('party-add-modal').style.display = 'block';
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('party-select').value = '';
}
function hidePartyModal() {
  document.getElementById('party-add-modal').style.display = 'none';
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('quick-add-party-form').reset();
}

// ========== SAVE QUICK PARTY ==========
async function saveQuickParty() {
  const name = document.getElementById('quick-party-name').value.trim();
  const mobile = document.getElementById('quick-party-mobile').value.trim();
  const email = document.getElementById('quick-party-email').value.trim();
  
  if (!name || !mobile) {
    alert('❌ Name and Mobile are required!');
    return;
  }
  if (!/^[0-9]{10}$/.test(mobile)) {
    alert('❌ Please enter valid 10 digit mobile number!');
    return;
  }
  const customerData = {
    name,
    mobile,
    email,
    status: 'Active'
  };
  try {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    if (!response.ok) throw new Error('Failed to add party');
    const newCustomer = await response.json();
    alert(`✅ Party "${name}" added successfully!`);
    await loadCustomersForDropdown();
    document.getElementById('party-select').value = newCustomer.id;
    hidePartyModal();
  } catch (error) {
    console.error('Error adding party:', error);
    alert('❌ Failed to add party: ' + error.message);
  }
}

// ========== LOGIN PROTECTION ==========
const loggedInUser = localStorage.getItem('loggedInUser');
if (!loggedInUser) {
  window.location.href = '/modules/login/login.html';
}

// ========== LOGOUT FUNCTION ==========
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = '/modules/login/login.html';
}
// Example HTML: <button onclick="logout()">Logout</button>
