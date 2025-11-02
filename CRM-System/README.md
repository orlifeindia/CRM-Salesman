
http://127.0.0.1:5500/modules/login/login.html
username: admin, password: adminpass


Step 1: Folder Me Jao (Pehle Path)

cd C:\Users\victus\CRM-System\server

Step 2: Script Run Karo (Phir Command)
node recreate-tables.js

Agar Ye Error Aaye "Cannot find module 'pg'"
npm install

//--------
🧠 CRM Software Functional Format (Hindi + English)
1. 📥 Lead Management (लीड मैनेजमेंट) Purpose: नए leads को capture, qualify, aur convert karna Fields:
✅ Lead Name / लीड का नाम
✅ Mobile Number / मोबाइल नंबर
✅ Email id
-  Source (WhatsApp, Website, Referral) / स्रोत
✅ Interest Category / रुचि श्रेणी
✅ Status (New, Contacted, Converted) / स्थिति
Actions:
✅ Add/Edit/Delete Lead
✅ Bulk Import/Export (Excel/CSV)
✅ Search & Filter by status/category
- WhatsApp Auto-Reply Trigger on New Lead

नई लीड/ग्राहक जुड़ते ही ऑटो वेलकम WhatsApp संदेश (Auto Reply)

हर रिकार्ड या लिस्ट में WhatsApp बटन (मैन्युअल मैसेज भेजने के लिए)

एक साथ कई लोगों को Bulk WhatsApp (bulk send, select करके)

WhatsApp message templates की लिस्ट और मैनेजमेंट (जैसे- प्रमोशनल, बिलिंग, etc.)

WhatsApp मैसेज शेड्यूल करना (Scheduled/Future Messaging)

ऑर्डर/पेमेंट/अपडेट का WhatsApp नोटिफिकेशन (Auto status/message)

WhatsApp मैसेजिंग का लॉग और डिलिवरी/रीड रिपोर्ट (Log & Analytics)

Template approval और मैनेजमेंट पैनल (Meta-approved)

CSV से bulk contact import, WhatsApp messaging automation

WhatsApp opt-in/opt-out tab (User रोक सके या इनेबल कर सके)

इमेज, इनवॉयस, लिंक इत्यादि का WhatsApp से भेजना (media/doc)

CRM से ही WhatsApp chat (two way/full integration)

BASIC से लेकर ADVANCE सभी automation stepwise

2. 🧾 Customer Management (ग्राहक प्रबंधन) Purpose: Converted leads को customer में बदलना और उनका डेटा maintain करना Fields:
✅ Customer Name / ग्राहक का नाम
✅ Mobile Number / मोबाइल नंबर
✅ Address / पता
- Type (Distributor / Retail Customer) / प्रकार
- GST Number (if applicable) / जीएसटी नंबर
Actions:
✅ Add/Edit/Delete Customer
- WhatsApp Broadcast (Offers, Updates)
✅ Filter by Type or Location

3. 📦 Order Item Entry + Auto Calculation (ऑर्डर प्रविष्टि + गणना) Purpose: Order डालना, total calculate करना, aur delivery track karna
Fields:
✅ Order Date / ऑर्डर की तारीख
✅ Customer Name / ग्राहक का नाम
- Product Category / उत्पाद श्रेणी
- Product Name / उत्पाद का नाम
- Quantity / मात्रा
- Rate / दर
- GST % / जीएसटी प्रतिशत
- Total Amount (Auto-calculated) / कुल राशि
- Delivery Status / डिलीवरी स्थिति
Actions:
- Add/Edit/Delete Order
- Auto WhatsApp Confirmation Message
- Delivery Tracking (Pending / Shipped / Delivered)

4. 📲 WhatsApp Automation (व्हाट्सएप ऑटोमेशन)
Purpose: Manual effort कम करना और instant response देना
Flows:
- New Lead Auto-Reply (Product Categories + Benefits)
- Distributor Onboarding (Documents + Pricing)
- Order Confirmation (with Total + Delivery Date)
- Broadcast Templates (Offers, New Launches)
Format:
- Hindi + English message templates
- Button-based replies (e.g., “📦 Order Now”, “📄 View Catalog”)

5. 📊 Dashboard & Reports (डैशबोर्ड और रिपोर्ट्स)
Purpose: Real-time data dekhna aur decisions lena
Widgets:
- Total Leads / Customers / Orders
- Monthly Sales Chart
- Top Products
- Pending Deliveries
Reports:
- Exportable Excel / PDF
- Filter by Date, Category, Customer

6. 🔍 Search, Filter & Bulk Actions (खोज, फ़िल्टर और बल्क क्रियाएं)
Purpose: Speed aur efficiency badhane ke liye
Features:
- Search by Name, Mobile, Category
- Filter by Status, Type, Date
- Bulk Delete / Bulk Export
- Multi-select for WhatsApp Broadcast

7. 🛠️ Admin Settings (एडमिन सेटिंग्स)
Purpose: Control aur customization
Options:
- Add/Edit Product Categories
- Set GST Rates
- WhatsApp API Integration
- User Roles & Permissions

Agar aap chahein toh main is format ka ready-to-use bilingual form layout bhi bana sakta hoon — har section ke liye HTML/React code ya CRM builder logic. Batayein, kis module se shuru karein?








Wait karo (2-3 minute), phir:
node recreate-tables.js

C:\Users\victus\CRM-System\server\recreate-tables.js

Step 6: File Check Karo
CMD me ye command chalao:
dir C:\Users\victus\CRM-System\server\*.js

Ye dikhna chahiye:
server.js
recreate-tables.js
create-tables.js
(aur bhi files...)

Agar recreate-tables.js dikha to file ban gayi! ✅
cd C:\Users\victus\CRM-System\server
node recreate-tables.js

node server.js

http://localhost:3001/modules/consumer/consumer.html



npm start

🎯 Test करो Browser में:
http://localhost:3001

और API test:

http://localhost:3001/api/customers
http://localhost:3001/leads
http://localhost:3001/orders





📊 CRM सिस्टम - ग्राहक संबंध प्रबंधन
एक सरल और शक्तिशाली CRM सिस्टम जो ग्राहकों, लीड्स और ऑर्डर्स को मैनेज करता है।

✨ विशेषताएं
✅ उपभोक्ता प्रबंधन - ग्राहक जोड़ें, संपादित करें, हटाएं, खोजें

✅ लीड प्रबंधन - स्थिति के साथ लीड ट्रैकिंग (नया, संपर्क किया गया, परिवर्तित)

✅ ऑर्डर प्रबंधन - पूर्ण ऑर्डर प्रोसेसिंग

✅ व्हाट्सएप एकीकरण - सीधे व्हाट्सएप मैसेजिंग

✅ एक्सपोर्ट/इम्पोर्ट - लीड्स के लिए CSV एक्सपोर्ट/इम्पोर्ट

✅ रेस्पॉन्सिव डिज़ाइन - मोबाइल और डेस्कटॉप फ्रेंडली

🛠️ उपयोग की गई तकनीकें
फ्रंटएंड:
HTML5, CSS3, JavaScript (वैनिला)

कोई फ्रेमवर्क नहीं - शुद्ध JavaScript

बैकएंड:
Node.js

Express.js

PostgreSQL डेटाबेस

CORS सक्षम

📁 प्रोजेक्ट संरचना

CRM-System/
├── index.html                       # डैशबोर्ड (Dashboard)
├── shared/
│   ├── api.js                      # API Functions
│   ├── utils.js                    # Helper Functions
│   └── common.css                  # शेयरड स्टाइल्स (Global)
├── modules/
│   ├── consumer/
│   │   ├── consumer.html
│   │   └── consumer.js
│   ├── lead/
│   │   ├── lead.html
│   │   └── lead.js
│   ├── order/
│   │   ├── order.html
│   │   └── order.js
│   ├── sale/
│   │   ├── sale.html               # Sale Invoice page
│   │   ├── sale.js                 # Sale Invoice logic
│   │   └── sale.css                # Sale Styling
│   ├── purchase/
│   │   ├── purchase.html           # Purchase Invoice
│   │   ├── purchase.js
│   │   └── purchase.css
│   ├── accounts/
│   │   ├── accounts.html           # Ledgers/Payments etc
│   │   ├── accounts.js
│   │   └── accounts.css
│   ├── stock/
│   │   ├── stock.html              # Stock report/list
│   │   └── stock.js
│   └── vouchers/
│       ├── voucher.html
│       └── voucher.js
├── server/
│   ├── server.js
│   ├── routes/
│   │   ├── sale.js                 # API: /api/sales
│   │   ├── purchase.js             # API: /api/purchases
│   │   ├── accounts.js             # API: /api/accounts
│   │   └── ...others
│   └── db.js
└── package.json


🚀 इंस्टॉलेशन और सेटअप
पूर्वापेक्षाएँ (पहले ये इंस्टॉल करें):
Node.js (v14+)

PostgreSQL (v12+)

Git

चरण 1: रिपॉजिटरी क्लोन करें

git clone https://github.com/username/crm-system.git
cd CRM-System

चरण 2: डेटाबेस सेटअप
CREATE DATABASE crm_db;

-- ग्राहक तालिका
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    district VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    distributor_code VARCHAR(50),
    docket_no VARCHAR(50),
    shipping_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- लीड तालिका
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'New',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ऑर्डर तालिका
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    item VARCHAR(255),
    qty INTEGER,
    price DECIMAL(10,2),
    gst DECIMAL(5,2),
    total DECIMAL(10,2),
    delivery VARCHAR(255),
    transport VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

चरण 3: बैकएंड सेटअप
cd server
npm install

चरण 4: एनवायरनमेंट वेरिएबल्स
server/ फोल्डर में .env फाइल बनाएं:
DATABASE_URL=postgresql://username:password@localhost:5432/crm_db
PORT=3001

चरण 5: सर्वर स्टार्ट करें
npm start
सर्वर चलेगा: http://localhost:3001

चरण 6: फ्रंटएंड खोलें
विकल्प 1: index.html को ब्राउज़र में खोलें

विकल्प 2: VS Code में Live Server उपयोग करें

विकल्प 3: http://localhost:3001/ ब्राउज़र में खोलें

📖 उपयोग गाइड
उपभोक्ता प्रबंधन
डैशबोर्ड से "Consumer" टैब में जाएं

फॉर्म भरें (नाम, मोबाइल, ईमेल आवश्यक)

"Add Customer" बटन क्लिक करें

सर्च बॉक्स से खोजें

Edit/Delete बटन से संशोधित करें

लीड प्रबंधन
"Lead" टैब में जाएं

लीड विवरण दर्ज करें

स्थिति चुनें (नया, संपर्क किया, प्रगति में, परिवर्तित, खोया)

व्हाट्सएप बटन से सीधे संदेश भेजें

CSV एक्सपोर्ट के लिए लीड्स चुनें और "Export" क्लिक करें

ऑर्डर प्रबंधन
"Order" टैब में जाएं

पार्टी चुनें (या नई पार्टी जोड़ें)

HSN, मात्रा, मूल्य, GST के साथ आइटम जोड़ें

कुल राशि स्वचालित रूप से गणना होगी

"Submit Order" क्लिक करें

🔌 API एंडपॉइंट्स
ग्राहक
GET /api/customers - सभी ग्राहक प्राप्त करें

POST /api/customers - नया ग्राहक बनाएं

PUT /api/customers/:id - ग्राहक अपडेट करें

DELETE /api/customers/:id - ग्राहक हटाएं

लीड्स
GET /api/leads - सभी लीड्स प्राप्त करें

POST /api/leads - नई लीड बनाएं

PUT /api/leads/:id - लीड अपडेट करें

DELETE /api/leads/:id - लीड हटाएं

ऑर्डर्स
GET /api/orders - सभी ऑर्डर प्राप्त करें

POST /api/orders - नया ऑर्डर बनाएं

🐛 समस्या निवारण
सर्वर स्टार्ट नहीं हो रहा?
# पोर्ट जांचें
netstat -ano | findstr :3001

# .env में पोर्ट बदलें
PORT=3002

डेटाबेस कनेक्शन एरर?
PostgreSQL चल रहा है जांचें

.env फाइल में DATABASE_URL सही है जांचें

यूजरनेम/पासवर्ड सही है वेरिफाई करें

फ्रंटएंड API कॉल्स फेल?
सर्वर चल रहा है जांचें: http://localhost:3001/health

shared/api.js में API_BASE URL सही है जांचें

ब्राउज़र कंसोल में एरर देखें (F12)

📸 स्क्रीनशॉट्स
डैशबोर्ड
उपभोक्ता प्रबंधन
लीड प्रबंधन
👨‍💻 डेवलपमेंट
डेवलपमेंट मोड में रन करें:

cd server
npm install -g nodemon
nodemon server.js

कोड बदलाव करें:
फाइल में बदलाव करें

सेव करें (Ctrl+S)

ब्राउज़र रिफ्रेश करें (F5)

🤝 योगदान
योगदान स्वागत है! पुल रिक्वेस्ट भेज सकते हैं।

चरण:
प्रोजेक्ट फोर्क करें

नई ब्रांच बनाएं (git checkout -b feature/amazing-feature)

बदलाव कमिट करें (git commit -m 'Add amazing feature')

पुश करें (git push origin feature/amazing-feature)

पुल रिक्वेस्ट खोलें

📞 संपर्क
डेवलपर: आपका नाम
ईमेल: your.email@example.com
GitHub: @yourusername

🙏 आभार
Express.js समुदाय

PostgreSQL टीम

सभी योगदानकर्ता

भारत में ❤️ के साथ बनाया गया

📋 README.md के प्रमुख अनुभाग
अनुभाग	उद्देश्य
शीर्षक और विवरण	प्रोजेक्ट क्या है
विशेषताएं	क्या-क्या कर सकता है
तकनीकें	कौन सी तकनीक उपयोग हुई
इंस्टॉलेशन	कैसे सेटअप करें
उपयोग	कैसे उपयोग करें
API डॉक्स	एंडपॉइंट्स की सूची
समस्या निवारण	सामान्य समस्याओं के समाधान
स्क्रीनशॉट्स	दृश्य गाइड
संपर्क	मदद के लिए संपर्क जानकारी
📌 README.md क्यों महत्वपूर्ण है?
✅ नए डेवलपर्स को समझने में आसान

✅ सेटअप प्रक्रिया स्पष्ट हो जाती है

✅ दस्तावेज़ीकरण मिल जाता है

✅ GitHub पर पेशेवर दिखता है

✅ भविष्य में संदर्भ के लिए सहायक

 /////////////////////////////////////


📋 Summary - Jo Ban Gaya:
Component	Status
✅ Server	Running (Port 3001)
✅ Database	Connected (Render PostgreSQL)
✅ Tables	Created (customers, leads, orders)
✅ APIs	Working
✅ Customer API	/api/customers
✅ Lead API	/leads
✅ Order API	/orders



//---Sale Invoice ka pura code banao 1. Date 2. VcH No. 3. Type Callan ya Direct  4. sale type  ( GST tax %  option )  5.  
 party Name ( party name enter ke bad smal window open hona jisme party ki ditel check v update kar sakte he & smaal window close ) party slect karte hi down me smaal latter me party ( Cur.Bal. Show karna  7.  Narration 8. S.N. 9. Item slect karte hi last 3 tarnsaction windo me  show kana or table ke niche Stock Qty show karna  10. Qty. 11.  Price 12.Amount ( amount pe enter karte hi smal window me item gst % edit kar sakte he or ok ka button ok  karna  13. table ke down me total qty / Alt.qty / Amount total next 14. smal table banan jisme S.N. / Bill Sundry / Narration / Taxt Box Amount Rs  Bill sindery me  sare Slect karne option dena GST /  % Discount %  Fright & fording charge aadi  / Said me Tax Summary show karna 15. Ground Total 16 Save button 17. Quit Sare function Keybord se control hona mouse ki jarurat nahi tino file banake do html / js / css