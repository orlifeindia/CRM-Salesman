let customers = [];
let editIndex = null;
// -- Add these lines at TOP of app.js
let leads = [];
let editLeadIndex = null;


function showTab(tab) {
  document.getElementById("consumer-section").style.display = tab === "consumer" ? "block" : "none";
  document.getElementById("lead-section").style.display = tab === "lead" ? "block" : "none";
  document.getElementById("show-consumer-btn").classList.toggle("active", tab === "consumer");
  document.getElementById("show-lead-btn").classList.toggle("active", tab === "lead");
}

// ADD / UPDATE Customer Function
document.getElementById('customer-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const mobile = document.getElementById('mobile').value.trim();
  const status = document.getElementById('status').value.trim();
  if (!name || !email || !mobile) return alert("Fill all required fields");

  if (editIndex === null) {

    // ADD Customer
    fetch('https://your-api.onrender.com/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, status })
    })
      .then(res => res.json())
      .then(newCustomer => {
        customers.push(newCustomer); // API ने डाले गए customer का object वापस दिया
        renderCustomersTable();
        alert('Customer Added!');
        document.getElementById('customer-form').reset();
      });

  } else {
    // UPDATE customer
    const customerId = customers[editIndex].id;
    fetch(`https://your-api.onrender.com/api/customers/${customerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, status })
    })
      .then(res => res.json())
      .then(updatedCustomer => {
        // Option 1: fetch() again all customers, or just update local array
        customers[editIndex] = { id: customerId, name, email, mobile, status };
        renderCustomersTable();
        alert('Customer Updated!');
        editIndex = null;
        document.getElementById('submit-btn').textContent = 'Add Customer';
        document.getElementById('customer-form').reset();
      });
  }
});

// ---- RENDER TABLE (SHOW/EDIT/DELETE BUTTONS) ----
function renderCustomersTable() {
  const table = document.getElementById('customers-table');
  table.innerHTML = `<tr>
    <th>Name</th><th>Email</th><th>Mobile</th><th>Status</th><th>Actions</th>
  </tr>`;
  customers.forEach(function (cust, idx) {
    let row = table.insertRow();
    row.insertCell(0).textContent = cust.name;
    row.insertCell(1).textContent = cust.email;
    row.insertCell(2).textContent = cust.mobile;
    row.insertCell(3).textContent = cust.status;
    let actionCell = row.insertCell(4);

    // View Cunsumer 
    let viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.onclick = function () {
      alert(`Customer Details:\nName: ${cust.name}\nEmail: ${cust.email}\nMobile: ${cust.mobile}\nStatus: ${cust.status}`);
    };
    actionCell.appendChild(viewBtn);

    // Edit Cunsuner 
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function () {
      document.getElementById('name').value = cust.name;
      document.getElementById('email').value = cust.email;
      document.getElementById('mobile').value = cust.mobile;
      document.getElementById('status').value = cust.status;
      editIndex = idx;
      document.getElementById('submit-btn').textContent = 'Update Customer';
    };
    actionCell.appendChild(editBtn);
    
    // Delete Cunsumer
    let delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = function () {
      if (confirm('Delete this custom er?')) {
        const customerId = cust.id;
        fetch(`https://your-api.onrender.com/api/customers/${cust.id}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(result => {
            if (result.success || result.status === "Customer deleted successfully!") {
              customers.splice(idx, 1);
              renderCustomersTable();
            } else {
              alert('Delete failed: ' + (result.error || 'Unknown error'));
            }
        });
      }
    };
    actionCell.appendChild(delBtn);
  });
}

// -- Lead ADD/EDIT --
document.getElementById('lead-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('lead-name').value.trim();
  const mobile = document.getElementById('lead-mobile').value.trim();
  const email = document.getElementById('lead-email').value.trim();
  const status = document.getElementById('lead-status').value.trim();
   if (!name || !email || !mobile) return alert("Fill all required fields");
  if (editLeadIndex === null) {
    leads.push({ name, mobile, email, status });
    alert('Lead Added!');
  } else {
    leads[editLeadIndex] = { name, mobile, email, status };
    alert('Lead Updated!');
    editLeadIndex = null;
    document.getElementById('lead-submit-btn').textContent = 'Add Lead';
  }
  document.getElementById('lead-form').reset();
  renderLeadsTable();
});

// -- Lead Table Render & Actions --
function renderLeadsTable() {
  const table = document.getElementById('leads-table');
  table.innerHTML = `<tr>
    <th>Name</th><th>Mobile</th><th>Email</th><th>Status</th><th>Action</th>
  </tr>`;
  leads.forEach(function (lead, idx) {
    let row = table.insertRow();
    row.insertCell(0).textContent = lead.name;
    row.insertCell(1).textContent = lead.mobile;
    row.insertCell(2).textContent = lead.email;
    row.insertCell(3).textContent = lead.status;
    let actionCell = row.insertCell(4);

    // View
    let viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.onclick = function () {
      alert(`Lead Details:\nName: ${lead.name}\nMobile: ${lead.mobile}\nEmail: ${lead.email}\nStatus: ${lead.status}`);
    };
    actionCell.appendChild(viewBtn);

    // Edit
    let editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function () {
      document.getElementById('lead-name').value = lead.name;
      document.getElementById('lead-mobile').value = lead.mobile;
      document.getElementById('lead-email').value = lead.email;
      document.getElementById('lead-status').value = lead.status;
      editLeadIndex = idx;
      document.getElementById('lead-submit-btn').textContent = 'Update Lead';
    };
    actionCell.appendChild(editBtn);

    // WhatsApp
    let waBtn = document.createElement('button');
    waBtn.textContent = 'WhatsApp';
    waBtn.onclick = function () {
      const waNum = lead.mobile.replace(/\D/g, '');
      const waMsg = encodeURIComponent(`Hello ${lead.name}!`);
      const waUrl = `https://wa.me/${waNum}?text=${waMsg}`;
      window.open(waUrl, '_blank');
    };
    actionCell.appendChild(waBtn);

    // Delete
    let delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = function () {
      if (confirm('Delete this lead?')) {
        leads.splice(idx, 1);
        renderLeadsTable();
      }
    };
    actionCell.appendChild(delBtn);
  });
}

// ---- LOAD ALL CUSTOMERS FROM API ----
window.onload = function() {
  fetch('https://your-api.onrender.com/api/customers')
    .then(res => res.json())
    .then(data => {
      customers = data;
      renderCustomersTable();
    });
};
