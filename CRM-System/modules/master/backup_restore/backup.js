const backupPaths = {
  onedrive: "C:/Users/victus/OneDrive/Office orlife/Visual Studio Code/ERPBackups",
  local:    "D:/ERPBackups",
  gdrive:   "Google Drive App/Sync Folder",
  custom:   ""
};

// Custom path show/hide
document.getElementById('backupType').addEventListener('change', function(){
  const custom = document.getElementById('customPath');
  custom.style.display = (this.value === 'custom') ? 'block' : 'none';
});

function getSelectedBackupPath() {
  const sel = document.getElementById('backupType').value;
  if(sel !== "custom") return backupPaths[sel];
  return document.getElementById('customPath').value.trim() || "(Set Custom Path)";
}

// ******** Action Functions as window.prop ONLY once! ********

window.showBackups = function() {
  const backups = [
    {file: "erp_2025-10-27.sql", time: "27-Oct-2025, 8:21 PM"},
    {file: "erp_2025-10-26.sql", time: "26-Oct-2025, 7:01 PM"},
    {file: "erp_2025-10-25.sql", time: "25-Oct-2025, 5:29 PM"},
  ];
  let html = "";
  backups.forEach(b => html += `<li>${b.file} - <small>${b.time}</small></li>`);
  document.getElementById('backupList').innerHTML = html;
};
window.showBackups();

window.manualBackup = function() {
  const path = getSelectedBackupPath();
  document.getElementById('backupStatus').innerHTML = "Backing up to: <b>" + path + "</b> ...";
  setTimeout(() => {
    document.getElementById('backupStatus').innerHTML =
      '<span class="success">Backup Success! Saved at <b>' + path + '</b></span>';
    window.showBackups();
  }, 1500);
};

window.restoreBackup = function(e) {
  if (!e.target.files.length) return;
  const file = e.target.files[0];
  document.getElementById('backupStatus').innerHTML = "Restoring from: " + file.name + " ...";
  setTimeout(() => {
    document.getElementById('backupStatus').innerHTML =
      '<span class="success">Restore Complete! (' + file.name + ')</span>';
    e.target.value = "";
  }, 1600);
};

window.goBack = function() {
  window.history.back();
};
