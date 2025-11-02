const pool = require('./connection');

async function createTables() {
  try {
    console.log('🔄 Creating/updating tables...');

    // ========== CUSTOMERS TABLE ==========
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        district VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        distributor_code VARCHAR(100),
        docket_no VARCHAR(100),
        shipping_details TEXT,
        status VARCHAR(50) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Customers table ready');

    // Check if columns exist, add if missing
    const addColumnIfNotExists = async (table, column, type) => {
      try {
        await pool.query(`
          ALTER TABLE ${table} 
          ADD COLUMN IF NOT EXISTS ${column} ${type}
        `);
        console.log(`  ✓ Added ${column} to ${table}`);
      } catch (err) {
        // Column might already exist, ignore error
      }
    };

    // Add missing columns if they don't exist
    await addColumnIfNotExists('customers', 'address', 'TEXT');
    await addColumnIfNotExists('customers', 'city', 'VARCHAR(100)');
    await addColumnIfNotExists('customers', 'district', 'VARCHAR(100)');
    await addColumnIfNotExists('customers', 'state', 'VARCHAR(100)');
    await addColumnIfNotExists('customers', 'pincode', 'VARCHAR(10)');
    await addColumnIfNotExists('customers', 'distributor_code', 'VARCHAR(100)');
    await addColumnIfNotExists('customers', 'docket_no', 'VARCHAR(100)');
    await addColumnIfNotExists('customers', 'shipping_details', 'TEXT');

    // ========== LEADS TABLE ==========
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'New',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Leads table ready');

    // ========== ORDERS TABLE ==========
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        order_date DATE NOT NULL,
        quotation_no VARCHAR(100),
        narration TEXT,
        total_amount DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Orders table ready');

    // ========== ORDER ITEMS TABLE ==========
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        hsn_code VARCHAR(50),
        quantity INTEGER NOT NULL,
        unit VARCHAR(20),
        price DECIMAL(10,2) NOT NULL,
        gst_rate DECIMAL(5,2) NOT NULL,
        gst_amount DECIMAL(10,2),
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log('✅ Order items table ready');
    console.log('\n🎉 All tables created/updated successfully!\n');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

module.exports = { createTables };
