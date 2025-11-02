// ===== FRONTEND: shared/api.js =====

const API_BASE = 'http://localhost:3001/api';

// ===== Customers =====
async function fetchCustomers() {
  try {
    const response = await fetch(`${API_BASE}/customers`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

async function createCustomer(data) {
  try {
    const response = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

async function updateCustomer(id, data) {
  try {
    const response = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

async function deleteCustomer(id) {
  try {
    const response = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}

// ===== Leads =====
async function fetchLeads() {
  try {
    const response = await fetch(`${API_BASE}/leads`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
}

async function createLead(data) {
  try {
    const response = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
    return await response.json();
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

async function updateLead(id, data) {
  try {
    const response = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (error) {
    console.error('Error updating lead:', error);
    throw error;
  }
}

async function deleteLead(id) {
  try {
    const response = await fetch(`${API_BASE}/leads/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Error deleting lead:', error);
    throw error;
  }
}

// ===== Orders =====
async function fetchOrders() {
  try {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

async function createOrder(data) {
  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

async function updateOrder(id, data) {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

async function deleteOrder(id) {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete');
    return await response.json();
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

