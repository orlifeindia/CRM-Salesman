// Sidebar Masters open/close
const masterLi = document.querySelector('.master-li');
const masterBtn = masterLi.querySelector('.side-link-btn');
masterLi.addEventListener('mouseenter', () => masterLi.classList.add('master-open'));
masterLi.addEventListener('mouseleave', () => masterLi.classList.remove('master-open'));
masterBtn.addEventListener('click', () => {
  masterLi.classList.toggle('master-open');
});

// Chart.js Demo
const ctx = document.getElementById('mainChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Qtr1', 'Qtr2', 'Qtr3', 'Qtr4'],
    datasets: [{
      label: 'Revenue (₹ lakh)',
      data: [2.1, 3.6, 2.2, 4.0],
      backgroundColor: ['#0984e3','#55efc4','#ffeaa7','#fd79a8'],
    }]
  },
  options: {
    responsive: false,
    plugins: { legend: { display: false } }, 
    scales: { y: { beginAtZero:true } }
  }
});


// Shortcuts/Busy Functionality (with Keyboard)
const actions = {
  F2: () => alert('Add Master Click!'),
  F3: () => alert('Add Voucher Click!'),
  F4: () => alert('Add Payment Click!'),
  F5: () => alert('Add Receipt Click!'),
  F6: () => alert('Add Journal Click!'),
  F7: () => alert('Add Sales Click!'),
  F8: () => alert('Add Purchase Click!'),
  F10: () => alert('Lock Program Click!'),
  A: () => alert('Account Summary Click!'),
  B: () => alert('Balance Sheet Click!'),
  I: () => alert('Item Summary Click!'),
  G: () => alert('GST Summary Click!'),
  E: () => alert('Configuration Click!'),
  L: () => alert('Ledger Click!'),
  S: () => alert('Stock Status Click!'),
  T: () => alert('Trial Balance Click!')
};

// Button click (map to same action)
document.querySelectorAll('.busy-btns button').forEach(btn => {
  btn.onclick = () => {
    let key = btn.textContent.match(/\(([^)]+)\)/);
    if(key && actions[key[1]]) actions[key[1]]();
  };
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e){
  let k = e.key.toUpperCase();
  if(actions[e.code]) { actions[e.code](); e.preventDefault(); }
  else if(actions[k]) {actions[k](); e.preventDefault();}
});
