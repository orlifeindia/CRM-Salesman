// whatsapp.js
document.addEventListener('DOMContentLoaded', function () {
    // सभी Whatsapp module बटन (section switch) के लिए
    document.querySelectorAll('.wa-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.id;
            let content = "";

            // Auto Reply Module - unique HTML + Form
            if (id === "wa-send-auto") {
                content = `
                    <h3>Auto Reply Setup</h3>
                    <form id="wa-auto-form" style="margin-top:15px;">
                        <label>Template Message:</label>
                        <textarea id="wa-auto-msg" rows="3" required>नमस्ते {name}, Orlife में आपका स्वागत है!</textarea><br>
                        <input type="checkbox" id="wa-auto-enable" checked> Enable Auto Reply<br><br>
                        <button type="submit" class="wa-btn">Save & Activate</button>
                    </form>
                    <p id="wa-auto-status"></p>
                `;
                document.getElementById("wa-content").innerHTML = content;

                // Naya form DOM me aate hi eventListener lagao
                const autoForm = document.getElementById('wa-auto-form');
                if (autoForm) {
                    autoForm.addEventListener('submit', function (e) {
                        e.preventDefault();
                        //------ नीचे वाला fetch हटा दो ------
                        // const msg = document.getElementById('wa-auto-msg').value;
                        // const enabled = document.getElementById('wa-auto-enable').checked;
                        // fetch('/api/wa-autoreply', ...)
                        //--- ऊपर वाला backend route जब तक न बने, CALL मत करो ---

                        document.getElementById('wa-auto-status').innerText = "Auto-reply config saved (UI only, no backend call).";
                    });
                }
                return;
            }

            // बाकी modules के लिए switching text/content - placeholder
            switch (id) {
                case "wa-manual-msg":
                    content = "<h3>Manual WhatsApp Send</h3><p>Ek message type karo aur kisi bhi mobile pe WhatsApp bhejo.</p>";
                    break;
                case "wa-bulk":
                    content = "<h3>Bulk WhatsApp</h3><p>Multiple leads select kar ke bulk message bhejna yahan se possible hai.</p>";
                    break;
                case "wa-templates":
                    content = "<h3>Template Manager</h3><p>Common messages, festive offers, ya auto-reply ke template yahan add/edit karo.</p>";
                    break;
                case "wa-log":
                    content = "<h3>Message Logs</h3><p>Kaunse customer ko kya message gaya, delivery status, sab logs yahan dikhai denge.</p>";
                    break;
                default:
                    content = "<p>Yahan WhatsApp automation modules ki detail aayegi.</p>";
            }
            document.getElementById("wa-content").innerHTML = content;
        });
    });

    // [Optional] - अगर homepage पर default auto-form दिखता है (static HTML में)
    const autoForm = document.getElementById('wa-auto-form');
    if (autoForm) {
        autoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            //------ same here, koi fetch backend ko na bheje jab tak route bana nahi ------
            document.getElementById('wa-auto-status').innerText = "Auto-reply config saved (UI only, no backend call).";
        });
    }

    // Example: direct WhatsApp link from localStorage/template (as utility)
    window.sendLeadAutoWhatsApp = function(lead) {
        const waAutoEnabled = localStorage.getItem('wa_auto_enabled') === "true";
        if (!waAutoEnabled) return;
        let autoMsg = localStorage.getItem('wa_auto_msg') || "";
        autoMsg = autoMsg.replace("{name}", lead.name || "Customer");
        const cleanMobile = (lead.mobile || "").replace(/[^0-9]/g, '');
        const waUrl = `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(autoMsg)}`;
        window.open(waUrl, '_blank');
    }
});
