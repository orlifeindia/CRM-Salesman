// GLOBAL VARIABLES
var editCustomerId = null;
var allCustomers = [];
var allLeads = [];
var leads = [];
var editLeadId = null;

// DATA FETCH & TABLE SHOW
function renderTable() {
  fetch('http://localhost:3001/customers')
    .then(res => res.json())
    .then(all => {
      allCustomers = all;
      displayTable(allCustomers);
      // ------- SUMMARY --------
      var total = allCustomers.length;
      var active = allCustomers.filter(c => c.status && c.status.toLowerCase() === 'active').length;
      var inactive = allCustomers.filter(c => c.status && c.status.toLowerCase() === 'inactive').length;
      var potential = allCustomers.filter(c => c.status && c.status.toLowerCase() === 'potential').length;

      document.getElementById('summary').innerHTML =
        "Total Customers: " + total +
        " | Active: " + active +
        " | Inactive: " + inactive +
        " | Potential: " + potential;
    });
}

// ACTUAL TABLE RENDER
function displayTable(customers) {
  var table = document.getElementById('customers-table');
  table.innerHTML = `<tr>
    <th>Name</th>
    <th>Email</th>
    <th>Mobile</th>
    <th>Status</th>
    <th>Action</th>
  </tr>`;
  customers.forEach(function (cust) {
    var row = table.insertRow();
    row.insertCell(0).textContent = cust.name;
    row.insertCell(1).textContent = cust.email;
    row.insertCell(2).textContent = cust.mobile;
    row.insertCell(3).textContent = cust.status;
    var actionCell = row.insertCell(4);

    // View Button
    var viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.onclick = function () { viewCustomer(cust); };
    actionCell.appendChild(viewBtn);
    actionCell.appendChild(document.createTextNode(' '));

    // Edit Button
    var editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = function () { editCustomer(cust.id, cust); };
    actionCell.appendChild(editBtn);
    actionCell.appendChild(document.createTextNode(' '));

    // Delete Button
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = function () { deleteCustomer(cust.id); };
    actionCell.appendChild(deleteBtn);
  });
}

// VIEW FUNCTION (ALERT)
function viewCustomer(customer) {
  alert(
    "Customer Details:\n" +
    "Name: " + customer.name + "\n" +
    "Email: " + customer.email + "\n" +
    "Mobile: " + customer.mobile + "\n" +
    "Status: " + customer.status
  );
}

// EDIT FUNCTION
function editCustomer(id, customer) {
  document.getElementById('name').value = customer.name;
  document.getElementById('email').value = customer.email;
  document.getElementById('mobile').value = customer.mobile;
  document.getElementById('status').value = customer.status;
  editCustomerId = id;
  document.getElementById('submit-btn').textContent = 'Update Customer';
}

// DELETE FUNCTION
function deleteCustomer(id) {
  fetch('http://localhost:3001/customers/' + id, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(data => {
      alert('Customer Deleted!');
      renderTable();
    });
}

// FORM SUBMIT (ADD + EDIT)
document.getElementById('customer-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var mobile = document.getElementById('mobile').value;
  var status = document.getElementById('status').value;

  if (editCustomerId !== null) {
    // UPDATE CUSTOMER
    fetch('http://localhost:3001/customers/' + editCustomerId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, status })
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        alert('Customer Updated!');
        renderTable();
        document.getElementById('customer-form').reset();
        document.getElementById('submit-btn').textContent = 'Add Customer';
        editCustomerId = null;
      })
      .catch(error => {
        console.error('Update error:', error);
        alert('Update Error: ' + error.message);
      });

  } else {
    // ADD CUSTOMER
    fetch('http://localhost:3001/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, mobile, status })
    })
      .then(res => res.json())
      .then(data => {
        alert('Customer Added!');
        renderTable();
        document.getElementById('customer-form').reset();
      });
  }
});

// WhatsApp TABLE RENDER
function renderLeadsTable() {
  fetch('http://localhost:3001/leads')
    .then(res => res.json())
    .then(all => {
      allLeads = all;
      var table = document.getElementById('leads-table');
      table.innerHTML = `<tr>
        <th>Name</th><th>Mobile</th><th>Email</th><th>Status</th><th>Action</th>
       </tr>`;
      allLeads.forEach(function (lead) {
        var row = table.insertRow();
        row.insertCell(0).textContent = lead.name;
        row.insertCell(1).textContent = lead.mobile;
        row.insertCell(2).textContent = lead.email;
        row.insertCell(3).textContent = lead.status;

        var actionCell = row.insertCell(4);

        // View Button WhatsApp 
        var viewBtn = document.createElement('button');
        viewBtn.textContent = 'View';
        viewBtn.onclick = function () {
          alert(
            "Lead Details:\n" +
            "Name: " + lead.name + "\n" +
            "Mobile: " + lead.mobile + "\n" +
            "Email: " + lead.email + "\n" +
            "Status: " + lead.status
          );
        };
        actionCell.appendChild(viewBtn);

        // Edit Button WhatsApp 
        var editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.onclick = function () {
          document.getElementById('lead-name').value = lead.name;
          document.getElementById('lead-mobile').value = lead.mobile;
          document.getElementById('lead-email').value = lead.email;
          document.getElementById('lead-status').value = lead.status;
          editLeadId = lead.id;
          document.getElementById('lead-submit-btn').textContent = 'Update Lead';
        };
        actionCell.appendChild(editBtn);


        var waBtn = document.createElement('button');
        waBtn.textContent = 'WhatsApp';
        waBtn.onclick = function () {
          var waNum = '919246574995'; // यहीं fix कर दो (country code + नंबर)
          var waMsg = encodeURIComponent(
            `Hello! Mujhe aap se baat karni hai.` // वरना dynamic message
          );
          var waUrl = `https://wa.me/${waNum}?text=${waMsg}`;
          window.open(waUrl, '_blank');
        };
        actionCell.appendChild(waBtn);


        // Delete Button WhatsApp
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function () {
          if (confirm("Lead ko sach me delete karna hai?")) {
            fetch('http://localhost:3001/leads/' + lead.id, {
              method: 'DELETE'
            })
              .then(res => res.json())
              .then(data => {
                alert('Lead Deleted!');
                renderLeadsTable();
              });
          }
        };
        actionCell.appendChild(deleteBtn);

        // LEAD TABLE SHOW & ACTIONS

        // View Button
        var viewBtn = document.createElement('button');

        viewBtn.onclick = function () {
          alert(
            "Lead Details:\n" +
            "Name: " + lead.name + "\n" +
            "Mobile: " + lead.mobile + "\n" +
            "Email: " + lead.email + "\n" +
            "Status: " + lead.status
          );
        };
        actionCell.appendChild(viewBtn);

      });
    });
}

// LEAD FORM SUBMIT (ADD + EDIT)
document.getElementById('lead-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var name = document.getElementById('lead-name').value;
  var mobile = document.getElementById('lead-mobile').value;
  var email = document.getElementById('lead-email').value;
  var status = document.getElementById('lead-status').value;

  if (editLeadId !== null) {
    // UPDATE LEAD
    fetch('http://localhost:3001/leads/' + editLeadId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, email, status })
    })
      .then(res => res.json())
      .then(data => {
        alert('Lead Updated!');
        renderLeadsTable();
        document.getElementById('lead-form').reset();
        editLeadId = null;
        document.getElementById('lead-submit-btn').textContent = 'Add Lead';
      });
  } else {
    // ADD LEAD
    fetch('http://localhost:3001/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, mobile, email, status })
    })
      .then(res => res.json())
      .then(data => {
        alert('Lead Added!');
        renderLeadsTable();
        document.getElementById('lead-form').reset();
      });
  }
});
// On Page Load
window.onload = function () {
  renderTable();
  renderLeadsTable();
};
