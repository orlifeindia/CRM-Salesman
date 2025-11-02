// ========== ORDER MODULE JAVASCRIPT ==========

let orderItems = [];
let customers = [];
let grandTotal = 0;

// ========== PAGE LOAD ==========
window.addEventListener('DOMContentLoaded', function() {
  loadCustomersForDropdown();
  setupOrderEventListeners();
  setTodayDate();
});

// ========== SET TODAY'S DATE ==========
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('order-date').value = today;
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
    
    // Add "Add New Party" option
    const addNewOption = document.createElement('option');
    addNewOption.value = 'add-new';
    addNewOption.textContent = '+ Add New Party';
    partySelect.appendChild(addNewOption);
    
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// ========== EVENT LISTENERS ==========
function setupOrderEventListeners() {
  // Item form submit
  document.getElementById('order-item-form').addEventListener('submit', function(e) {
    e.preventDefault();
    addItemToOrder();
  });
  
  // Submit order button
  document.getElementById('submit-order-btn').addEventListener('click', submitCompleteOrder);
  
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

// ========== ADD ITEM TO ORDER ==========
function addItemToOrder() {
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
  
  orderItems.push(item);
  renderOrderTable();
  document.getElementById('order-item-form').reset();
  document.getElementById('item-unit').value = 'Pcs';
  document.getElementById('item-gst').value = '18';
  document.getElementById('item-qty').value = '1';
}

// ========== RENDER ORDER TABLE ==========
function renderOrderTable() {
  const tbody = document.querySelector('#order-table tbody');
  tbody.innerHTML = '';
  
  if (orderItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" style="text-align:center; color:#999; padding: 20px;">No items added yet</td></tr>';
    document.getElementById('grand-total').textContent = '₹0.00';
    return;
  }
  
  grandTotal = 0;
  
  orderItems.forEach((item, index) => {
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
          <button onclick="removeItem(${item.id})" style="background: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">🗑️ Remove</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
  
  document.getElementById('grand-total').textContent = `₹${grandTotal.toFixed(2)}`;
}

// ========== REMOVE ITEM ==========
window.removeItem = function(itemId) {
  if (!confirm('Remove this item from order?')) return;
  
  orderItems = orderItems.filter(item => item.id !== itemId);
  renderOrderTable();
}

// ========== SUBMIT COMPLETE ORDER ==========
async function submitCompleteOrder() {
  const customerId = document.getElementById('party-select').value;
  const orderDate = document.getElementById('order-date').value;
  const quotationNo = document.getElementById('quotation-no').value.trim();
  const narration = document.getElementById('narration').value.trim();
  
  // Validation
  if (!customerId || customerId === 'add-new') {
    alert('❌ Please select a party!');
    return;
  }
  
  if (!orderDate) {
    alert('❌ Please select order date!');
    return;
  }
  
  if (orderItems.length === 0) {
    alert('❌ Please add at least one item!');
    return;
  }
  
  const orderData = {
    customer_id: parseInt(customerId),
    order_date: orderDate,
    quotation_no: quotationNo,
    narration: narration,
    total_amount: grandTotal,
    status: 'Pending',
    items: orderItems.map(item => ({
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
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) throw new Error('Failed to save order');
    
    const result = await response.json();
    alert(`✅ Order created successfully!\nOrder ID: ${result.id}\nTotal: ₹${grandTotal.toFixed(2)}`);
    
    // Reset form
    resetOrderForm();
    
  } catch (error) {
    console.error('Error saving order:', error);
    alert('❌ Failed to save order: ' + error.message);
  }
}

// ========== RESET ORDER FORM ==========
function resetOrderForm() {
  document.getElementById('party-select').value = '';
  document.getElementById('quotation-no').value = '';
  document.getElementById('narration').value = '';
  setTodayDate();
  
  orderItems = [];
  renderOrderTable();
}

// ========== SHOW PARTY MODAL ==========
function showPartyModal() {
  document.getElementById('party-add-modal').style.display = 'block';
  document.getElementById('modal-overlay').style.display = 'block';
  document.getElementById('party-select').value = '';
}

// ========== HIDE PARTY MODAL ==========
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
    
    // Reload dropdown and select new party
    await loadCustomersForDropdown();
    document.getElementById('party-select').value = newCustomer.id;
    
    hidePartyModal();
    
  } catch (error) {
    console.error('Error adding party:', error);
    alert('❌ Failed to add party: ' + error.message);
  }
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

// Example: logout button ka onclick
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = '/modules/login/login.html';
}

// Example HTML: <button onclick="logout()">Logout</button>
