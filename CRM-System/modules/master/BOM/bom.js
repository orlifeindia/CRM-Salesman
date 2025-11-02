// ------- INIT with 5 rows in both tables ----------
function addRawRow(item, qty, unt) {
  const tBody = document.querySelector('#rawTable tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td class="center">${tBody.children.length + 1}</td>
    <td><input type="text" value="${item||''}" class="item-cell"></td>
    <td><input type="number" value="${qty||''}" min="0" step="0.001" class="qty-cell"></td>
    <td><input type="text" value="${unt||'Pcs'}"></td>
  `;
  tBody.appendChild(row);
  calcRawTotal();
  row.querySelector('.qty-cell').addEventListener('input', calcRawTotal);
}

function addBPRow(item, qty, unt) {
  const tBody = document.querySelector('#bpTable tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td class="center">${tBody.children.length + 1}</td>
    <td><input type="text" value="${item||''}"></td>
    <td><input type="number" value="${qty||''}" min="0" step="0.001" class="bpqty-cell"></td>
    <td><input type="text" value="${unt||'Pcs'}"></td>
  `;
  tBody.appendChild(row);
  calcBPTotal();
  row.querySelector('.bpqty-cell').addEventListener('input', calcBPTotal);
}
function calcRawTotal() {
  let tot = 0;
  document.querySelectorAll('#rawTable .qty-cell').forEach(q => {
    tot += parseFloat(q.value || "0");
  });
  document.getElementById('rawTotal').textContent = tot.toFixed(3);
}
function calcBPTotal() {
  let tot = 0;
  document.querySelectorAll('#bpTable .bpqty-cell').forEach(q => {
    tot += parseFloat(q.value || "0");
  });
  document.getElementById('bpTotal').textContent = tot.toFixed(3);
}


// On load, 5 rows each
for(let i=0;i<5;i++) addRawRow();
for(let i=0;i<5;i++) addBPRow();
// Enter key to next field (ERP style)
document.getElementById('bomForm').addEventListener('keydown', function(e){
  if(e.key === 'Enter') {
    let all = Array.from(this.querySelectorAll('input,select')).filter(f=>f.offsetParent!==null && !f.disabled);
    let idx = all.findIndex(x => x === document.activeElement);
    if(idx > -1 && idx < all.length-1) {
      all[idx+1].focus();
      e.preventDefault();
    }
  }
});

// Save button event (for demo)
document.getElementById('bomForm').addEventListener('submit', function(e){
  e.preventDefault();
  alert('BOM Saved! (Demo)');
});
