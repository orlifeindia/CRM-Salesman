// ========== LEAD Global Variables ==========
let leads = [];
let editMode = false;
let editId = null;
let leadData = {};


// ========== PAGE LOAD ==========
window.addEventListener('DOMContentLoaded', function() {
  loadLeads();
  setupLeadEventListeners();

  // SINGLE status change listener!
  document.getElementById('lead-status').addEventListener('change', function(e) {
    if (e.target.value === 'Converted' && editMode) {
      const confirmConvert = confirm('🔄 Status changed to "Converted".\n\nDo you want to automatically create a Customer record?');
      if (!confirmConvert) e.target.value = 'In Progress';
    }
  });
});

// ========== EVENT LISTENERS ==========
function setupLeadEventListeners() {
  document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveLead();
  });
  document.getElementById('export-selected-leads-btn').addEventListener('click', exportSelectedLeads);
  document.getElementById('export-all-leads-btn').addEventListener('click', exportAllLeads);
  document.getElementById('bulk-whatsapp-btn').addEventListener('click', sendBulkWhatsApp);
  document.getElementById('import-leads-btn').addEventListener('click', importLeadsFromCSV);
  document.getElementById('select-all-leads').addEventListener('change', toggleSelectAll);
}

// ========== LOAD LEADS ==========
async function loadLeads() {
  try {
    const response = await fetch(`${API_BASE}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    leads = await response.json();
    renderLeadsTable();
    updateSummary();
  } catch (error) {
    console.error('Error loading leads:', error);
    alert('❌ Failed to load leads');
  }
}

// ========== RENDER LEADS TABLE ==========
function renderLeadsTable() {
  const tbody = document.querySelector('#leads-table tbody');
  tbody.innerHTML = '';
  if (leads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#999; padding: 20px;">No leads found</td></tr>';
    return;
  }
  leads.forEach((lead, index) => {
    const statusColor = getStatusColor(lead.status);
    const row = `
      <tr style="border-bottom: 1px solid #e9ecef;">
        <td style="text-align: center;">
          <input type="checkbox" class="lead-checkbox" data-id="${lead.id}" data-mobile="${lead.mobile}" style="cursor: pointer; width: 18px; height: 18px;">
        </td>
        <td style="text-align: center; font-weight: bold; color: #6c757d;">${index + 1}</td>
        <td><strong style="color: #2c3e50;">${lead.name}</strong></td>
        <td style="color: #495057;">${lead.mobile}</td>
        <td style="color: #495057;">${lead.email || '-'}</td>
        <td style="text-align: center;">
          <span style="background: ${statusColor}; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">
            ${lead.status}
          </span>
        </td>
        <td style="text-align: center; white-space: nowrap;">
          <button onclick="sendWhatsApp('${lead.mobile}')" style="background: #25d366; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; font-size: 13px;">📱 WhatsApp</button>
          <button onclick="editLead(${lead.id})" style="background: #ffc107; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; margin-right: 5px; font-size: 13px;">✏️ Edit</button>
          <button onclick="deleteLead(${lead.id})" style="background: #dc3545; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">🗑️ Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ========== GET STATUS COLOR ==========
function getStatusColor(status) {
  const colors = {
    'New': '#6c757d',
    'Contacted': '#17a2b8',
    'In Progress': '#ffc107',
    'Converted': '#28a745',
    'Lost': '#dc3545'
  };
  return colors[status] || '#6c757d';
}

// ========== lead-search ==========
function filterLeadList() {
  const input = document.getElementById("lead-search-box").value.toLowerCase();
  const rows = document.querySelectorAll("#leads-table tbody tr");

  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(input) ? "" : "none";
  });
}

// ========== UPDATE SUMMARY ==========
function updateSummary() {
  const summaryDiv = document.getElementById('summary');
  if (summaryDiv) {
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === 'New').length,
      contacted: leads.filter(l => l.status === 'Contacted').length,
      converted: leads.filter(l => l.status === 'Converted').length
    };
    summaryDiv.textContent = `📊 Total: ${stats.total} | New: ${stats.new} | Contacted: ${stats.contacted} | Converted: ${stats.converted}`;
  }
}

// ========== SAVE LEAD (ADD/UPDATE) ==========
async function saveLead() {
  const leadData = {
    name: document.getElementById('lead-name').value.trim(),
    mobile: document.getElementById('lead-mobile').value.trim(),
    email: document.getElementById('lead-email').value.trim(),
    status: document.getElementById('lead-status').value
  };

  // Validation
  if (!leadData.name || !leadData.mobile) {
    alert('❌ Name and Mobile are required!');
    return;
  }
  if (!/^[0-9]{10}$/.test(leadData.mobile)) {
    alert('❌ Please enter valid 10 digit mobile number');
    return;
  }

  try {
    let response;
    if (editMode && editId) {
      // UPDATE EXISTING LEAD
      response = await fetch(`${API_BASE}/leads/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (!response.ok) throw new Error('Failed to update lead');
      // ✅ CHECK IF STATUS CHANGED TO "CONVERTED"
      if (leadData.status === 'Converted') {
        await convertLeadToCustomer(leadData, editId);
      } else {
        alert('✅ Lead updated successfully!');
      }
      clearForm();
    } else {
      // ADD NEW LEAD
      response = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      });
      if (!response.ok) throw new Error('Failed to save lead');
      const newLead = await response.json();
      // ✅ CHECK IF NEW LEAD IS "CONVERTED"
      if (leadData.status === 'Converted') {
        await convertLeadToCustomer(leadData, newLead.id);
      } else {
        alert('✅ Lead added successfully!');
      }
      document.getElementById('lead-form').reset();
    }
    loadLeads();
  } catch (error) {
    console.error('❌ Error saving lead:', error);
    alert('❌ Failed to save lead');
  }
}

// ========== EDIT LEAD (INLINE) ==========
window.editLead = function(id) {
  const lead = leads.find(l => l.id === id);
  if (!lead) {
    alert('❌ Lead not found!');
    return;
  }
  document.getElementById('lead-name').value = lead.name;
  document.getElementById('lead-mobile').value = lead.mobile;
  document.getElementById('lead-email').value = lead.email || '';
  document.getElementById('lead-status').value = lead.status;
  editMode = true;
  editId = id;
  const submitBtn = document.querySelector('#lead-form button[type="submit"]');
  submitBtn.textContent = '🔄 Update Lead';
  submitBtn.style.background = 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
  document.getElementById('lead-form').scrollIntoView({ behavior: 'smooth' });
}

// ========== CLEAR FORM ==========
function clearForm() {
  document.getElementById('lead-form').reset();
  editMode = false;
  editId = null;
  const submitBtn = document.querySelector('#lead-form button[type="submit"]');
  submitBtn.textContent = '✅ Add Lead';
  submitBtn.style.background = 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
}
window.clearForm = clearForm;

// ========== DELETE LEAD ==========
window.deleteLead = async function(id) {
  if (!confirm('⚠️ Are you sure you want to delete this lead?')) return;
  try {
    const response = await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete lead');
    alert('✅ Lead deleted successfully!');
    loadLeads();
  } catch (error) {
    console.error('Error deleting lead:', error);
    alert('❌ Failed to delete lead');
  }
}

// ========== AUTO-CONVERT LEAD TO CUSTOMER ==========
async function convertLeadToCustomer(leadData, leadId) {
  const confirmConvert = confirm(
    `🔄 Convert Lead to Customer?\n\n` +
    `Name: ${leadData.name}\n` +
    `Mobile: ${leadData.mobile}\n` +
    `Email: ${leadData.email || 'N/A'}\n\n` +
    `This will:\n` +
    `✅ Create a new customer record\n` +
    `✅ Keep the lead with "Converted" status\n\n` +
    `Continue?`
  );
  if (!confirmConvert) {
    alert('✅ Lead status updated (without creating customer)');
    return;
  }
  try {
    const customerData = {
      name: leadData.name,
      mobile: leadData.mobile,
      email: leadData.email || '',
      address: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      distributor_code: '',
      docket_no: '',
      shipping_details: `Converted from Lead ID: ${leadId} on ${new Date().toLocaleDateString()}`,
      status: 'Active'
    };
    const customerResponse = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    if (!customerResponse.ok) {
      const errorData = await customerResponse.json();
      throw new Error(errorData.error || 'Failed to create customer');
    }
    const newCustomer = await customerResponse.json();
    const viewCustomer = confirm(
      `🎉 SUCCESS! Lead Converted to Customer!\n\n` +
      `Customer ID: ${newCustomer.id}\n` +
      `Name: ${newCustomer.name}\n` +
      `Mobile: ${newCustomer.mobile}\n\n` +
      `Would you like to view the Consumer module now?`
    );
    if (viewCustomer) window.location.href = '../consumer/consumer.html';
  } catch (error) {
    console.error('❌ Error converting lead:', error);
    alert('⚠️ Lead status updated to "Converted" but failed to create customer.\n\nPlease manually add to Consumer module.');
  }
}

// ========== SEND WHATSAPP ==========
function sendLeadAutoWhatsApp(lead) {
  if (!lead || !lead.mobile) {
    alert("Valid lead/mobile required!");
    return;
  }
  const cleanMobile = (lead.mobile + '').replace(/[^0-9]/g, '');
  const autoMessage = 
    `नमस्ते ${lead.name || "Customer"},\n` +
    `Orlife टीम में आपका स्वागत है!\nहमारी टीम जल्द ही आपसे संपर्क करेगी।\nधन्यवाद!`;
  const waUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(autoMessage)}`;
  window.open(waUrl, '_blank');
}

// Example usage in New Lead:
if (!editMode && leadData && leadData.mobile) { // New lead only
  sendLeadAutoWhatsApp(leadData);
}


// ========== SEND BULK WHATSAPP ==========
function sendBulkWhatsApp() {
  const selectedCheckboxes = document.querySelectorAll('.lead-checkbox:checked');
  if (selectedCheckboxes.length === 0) {
    alert('❌ Please select at least one lead!');
    return;
  }
  const message = prompt(`Send WhatsApp message to ${selectedCheckboxes.length} leads:`, 'Hello! Thank you for your interest in our products.');
  if (!message) return;
  let successCount = 0;
  selectedCheckboxes.forEach((checkbox, index) => {
    const mobile = checkbox.dataset.mobile;
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    setTimeout(() => {
      const whatsappURL = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(message)}`;
      window.open(whatsappURL, '_blank');
      successCount++;
      if (successCount === selectedCheckboxes.length) {
        alert(`✅ Opened WhatsApp for ${successCount} leads!`);
      }
    }, index * 2000); // 2 second delay between each
  });
}

// ========== TOGGLE SELECT ALL ==========
function toggleSelectAll(e) {
  const checkboxes = document.querySelectorAll('.lead-checkbox');
  checkboxes.forEach(checkbox => { checkbox.checked = e.target.checked; });
}

// ========== EXPORT SELECTED LEADS ==========
function exportSelectedLeads() {
  const selectedCheckboxes = document.querySelectorAll('.lead-checkbox:checked');
  if (selectedCheckboxes.length === 0) {
    alert('❌ Please select at least one lead to export!');
    return;
  }
  const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
  const selectedLeads = leads.filter(lead => selectedIds.includes(lead.id));
  exportToCSV(selectedLeads, `selected_leads_${new Date().toISOString().split('T')[0]}.csv`);
}

// ========== EXPORT ALL LEADS ==========
function exportAllLeads() {
  if (leads.length === 0) {
    alert('❌ No leads to export!');
    return;
  }
  exportToCSV(leads, `all_leads_${new Date().toISOString().split('T')[0]}.csv`);
}

// ========== EXPORT TO CSV ==========
function exportToCSV(data, filename) {
  let csv = 'S.No,Name,Mobile,Email,Status\n';
  data.forEach((lead, idx) => {
    csv += `${idx + 1},"${lead.name}","${lead.mobile}","${lead.email || ''}","${lead.status}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert(`✅ Exported ${data.length} leads to ${filename}`);
}

// ========== IMPORT LEADS FROM CSV ==========
function importLeadsFromCSV() {
  const fileInput = document.getElementById('lead-import-file');
  const file = fileInput.files[0];
  if (!file) {
    alert('❌ Please select a CSV file to import!');
    return;
  }
  if (!file.name.endsWith('.csv')) {
    alert('❌ Please select a valid CSV file!');
    return;
  }
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const text = e.target.result;
      const lines = text.split('\n');
      const dataLines = lines.slice(1).filter(line => line.trim());
      let successCount = 0;
      let errorCount = 0;
      for (const line of dataLines) {
        const [, name, mobile, email, status] = line.split(',').map(field => field.trim().replace(/"/g, ''));
        if (!name || !mobile) {
          errorCount++; continue;
        }
        try {
          const response = await fetch(`${API_BASE}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              mobile,
              email: email || '',
              status: status || 'New'
            })
          });
          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }
      alert(`✅ Import completed!\nSuccess: ${successCount}\nErrors: ${errorCount}`);
      loadLeads();
      fileInput.value = '';
    } catch (error) {
      console.error('Import error:', error);
      alert('❌ Failed to import CSV file!');
    }
  };
  reader.readAsText(file);
}
