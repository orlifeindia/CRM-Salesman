// unit.js

// ========== ENTER -> NEXT FIELD NAVIGATION ==========
document.getElementById('unit-form').addEventListener('keydown', function(e){
  if(e.key === 'Enter') {
    let inputs = Array.from(this.querySelectorAll('input,button'));
    let idx = inputs.findIndex(x => x === document.activeElement);
    if(idx > -1 && idx < inputs.length-1) {
      inputs[idx+1].focus();
      e.preventDefault();
    }
  }
});

// ========== FORM SUBMIT HANDLER ==========
document.getElementById('unit-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const unitName = document.getElementById('unitName').value.trim();
  const alias = document.getElementById('alias').value.trim();
  const printName = document.getElementById('printName').value.trim();
  const uqc = document.getElementById('uqc').value.trim();

  try {
    const res = await fetch('http://localhost:3001/api/units', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        unit_name: unitName, 
        alias, 
        print_name: printName, 
        uqc 
      })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('result').innerHTML = '✅ Unit created successfully!';
      document.getElementById('result').style.color = '#28c382';
      document.getElementById('unit-form').reset();
      document.getElementById('unitName').focus();
    } else {
      document.getElementById('result').innerHTML = '❌ ' + (data.error || 'Unit creation failed!');
      document.getElementById('result').style.color = '#e74c3c';
    }
  } catch (err) {
    document.getElementById('result').innerHTML = '❌ Network error!';
    document.getElementById('result').style.color = '#e74c3c';
  }
});

// ========== QUIT BUTTON HANDLER ==========
document.querySelector('.unit-btn.quit').addEventListener('click', function() {
  if(confirm('Are you sure you want to quit?')) {
    window.location.href = '/index.html'; // or wherever you want to redirect
  }
});

// ========== AUTO-FOCUS ON LOAD ==========
window.addEventListener('DOMContentLoaded', function() {
  document.getElementById('unitName').focus();
});
