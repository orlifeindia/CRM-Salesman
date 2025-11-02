document.getElementById('admin-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value.trim() || 'admin';
  const result = document.getElementById('result');
  
  // Validation
  if (!username || !password) {
    result.className = 'error';
    result.innerHTML = 'Please fill all required fields!';
    return;
  }
  if (password.length < 6) {
    result.className = 'error';
    result.innerHTML = 'Password must be at least 6 characters!';
    return;
  }

  // Dummy (Success) - backend call/replace as needed
  result.className = '';
  result.innerHTML = "Processing...";

  setTimeout(() => {
    result.className = 'success';
    result.innerHTML = `User "${username}" created successfully with role: ${role}`;
    document.getElementById('admin-form').reset();
  }, 900);
});
