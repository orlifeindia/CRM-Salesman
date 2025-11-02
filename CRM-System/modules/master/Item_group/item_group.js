// --------- Enter key - Auto "Next Field" like Tally/ERP --------
document.getElementById('groupForm').addEventListener('keydown', function(e){
  if(e.key === 'Enter') {
    let all = Array.from(this.querySelectorAll('input,select'))
                  .filter(f => !f.disabled && f.offsetParent !== null && f.type !== 'hidden');
    let idx = all.findIndex(x => x === document.activeElement);
    if(idx > -1 && idx < all.length-1) {
      all[idx+1].focus();
      e.preventDefault();
    }
  }
});

// --------- Hide/show Under Group ---------
const pgSel = document.getElementById('primaryGroup');
const ugRow = document.getElementById('underGroupRow');
function toggleUnderGroup() {
  if(pgSel.value === 'N') {
    ugRow.classList.remove('hidden');
  } else {
    ugRow.classList.add('hidden');
  }
}
pgSel.addEventListener('change', toggleUnderGroup);
toggleUnderGroup(); // On page load

// --------- Success Alert on Save (No Mouse Needed) ---------
document.getElementById('groupForm').addEventListener('submit', function(e){
  e.preventDefault();
  alert("Success! Group saved.");
  // Optionally: this.reset(); // form clear after save
});
