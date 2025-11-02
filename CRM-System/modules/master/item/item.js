// ========== GLOBALS =======
 [
  { name:"Battery 1000mAh", alias:"BATT1000", printName:"Battery 1000mAh" },
  { name:"Charger 5V", alias:"Charge5", printName:"Charger 5 Volt" }
];
let editMode = false;
let editIndex = null;
let selectedIdx = -1;

const nameInput = document.getElementById('name');
const aliasInput = document.getElementById('alias');
const printNameInput = document.getElementById('printname');
const suggestionBox = document.getElementById('item-suggestions');

// SUGGESTION
function showSuggestions(val) {
  const valL = val.toLowerCase();
  const result = itemList.filter(i => i.name.toLowerCase().includes(valL));
  if (result.length) {
    suggestionBox.innerHTML = result.map((i, idx) =>
      `<div ${selectedIdx===idx?'class="active"':''} data-idx="${idx}">
        ${i.name}
        <button type="button" class="edit-btn" tabindex="-1"
          onclick="event.stopPropagation();window.editItemOption('${i.name}')">✎ Edit</button>
      </div>`
    ).join("");
    selectedIdx = 0;
    suggestionBox.children[selectedIdx]?.classList.add("active");
    suggestionBox.style.display = "block";
  } else {
    suggestionBox.innerHTML = `<div class="add-new">➕ Add "<span>${val.replace(/</g, '&lt;')}</span>" as New Item</div>`;
    selectedIdx = 0;
    suggestionBox.style.display = "block";
  }
}
nameInput.addEventListener('input', function() {
  const val = this.value.trim();
  if(val.length < 1) { suggestionBox.style.display="none"; selectedIdx=-1; return; }
  showSuggestions(val);
});

// KEYS
nameInput.addEventListener('keydown', function(e) {
  const items = Array.from(suggestionBox.children);
  if (suggestionBox.style.display !== "block" || items.length === 0) return;
  if (e.key === "ArrowDown") {
    items[selectedIdx]?.classList.remove("active");
    selectedIdx = (selectedIdx+1) % items.length;
    items[selectedIdx]?.classList.add("active");
    e.preventDefault();
  }
  if (e.key === "ArrowUp") {
    items[selectedIdx]?.classList.remove("active");
    selectedIdx = (selectedIdx-1+items.length) % items.length;
    items[selectedIdx]?.classList.add("active");
    e.preventDefault();
  }
  if (e.key === "Enter") {
    if(items[selectedIdx]) {
      if(items[selectedIdx].classList.contains("add-new")) {
        aliasInput.value = ""; printNameInput.value="";
        suggestionBox.style.display = "none";
        selectedIdx = -1;
      } else {
        const selectedName = items[selectedIdx].innerText.replace(/✎ Edit.*/,"").trim();
        window.editItemOption(selectedName);
        suggestionBox.style.display = "none";
        selectedIdx = -1;
      }
      e.preventDefault();
    }
  }
});
suggestionBox.addEventListener('mousedown', function(e) {
  const div = e.target.closest('div');
  if (!div) return;
  if (div.classList.contains("add-new")) {
    aliasInput.value = ""; printNameInput.value="";
    nameInput.value = div.innerText.replace(/^\D+\s*|as New Item/g,"").replace(/"/g,"").trim();
  } else {
    const nm = div.textContent.replace(/✎ Edit.*/,"").trim();
    window.editItemOption(nm);
  }
  suggestionBox.style.display = "none";
  selectedIdx = -1;
});
nameInput.addEventListener('blur', function() {
  setTimeout(()=> { suggestionBox.style.display="none"; selectedIdx=-1; }, 120);
});



// ========== RENDER TABLE FUNCTION ========
function renderTable() {
  let tbl = '<table border="1" style="margin-top:12px;width:100%"><tr><th>Name</th><th>Alias</th><th>Print Name</th></tr>';
  itemList.forEach(i=>{
    tbl += `<tr><td>${i.name}</td><td>${i.alias}</td><td>${i.printName}</td></tr>`;
  });
  tbl += '</table>';
  document.getElementById('result').innerHTML = tbl;
}

// ========== EDIT LOGIC =========
window.editItemOption = function(itemName) {
  const idx = itemList.findIndex(x => x.name===itemName);
  const itm = itemList[idx];
  if(itm) {
    document.getElementById('name').value = itm.name;
    document.getElementById('alias').value = itm.alias||"";
    document.getElementById('printname').value = itm.printName||"";
    editMode = true;
    editIndex = idx;
  }
  document.getElementById('name').focus();
}

// ========== SAVE/EDIT LOGIC =========
document.getElementById('item-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const alias = document.getElementById('alias').value.trim();
  const printName = document.getElementById('printname').value.trim();

  if(!name) { document.getElementById('result').textContent="Name required!"; return; }

  if(editMode && editIndex!==null && itemList[editIndex] && itemList[editIndex].name===name) {
    itemList[editIndex] = { name, alias, printName };
    editMode = false;
    editIndex = null;
  } else {
    
     }
  renderTable();
  this.reset();
  document.getElementById('name').focus();
});

// ========== RESET LOGIC =========
document.getElementById('resetBtn').onclick = function(){
  document.getElementById('name').value = document.getElementById('alias').value = document.getElementById('printname').value = "";
  document.getElementById('result').textContent = "";
  editMode = false;
  editIndex = null;
  document.getElementById('name').focus();
};
