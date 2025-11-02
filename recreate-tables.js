const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://crm_db_ze2z_user:5dmM2ggGsWOxEyDukBYhBVQpSUNOGwHz@dpg-d3nj2749c44c73eadr1g-a.oregon-postgres.render.com:5432/crm_db_ze2z',
  ssl: { rejectUnauthorized: false }
});

async function recreateTables() {
  try {
    console.log('🔄 Recreating tables...\n');

    console.log('🗑️  Dropping old tables...');
    await pool.query('DROP TABLE IF EXISTS order_items CASCADE');
    await pool.query('DROP TABLE IF EXISTS orders CASCADE');
    await pool.query('DROP TABLE IF EXISTS leads CASCADE');
    await pool.query('DROP TABLE IF EXISTS customers CASCADE');
    console.log('✅ Old tables dropped!\n');

    console.log('📦 Creating CUSTOMERS table...');
    await pool.query(`
      CREATE TABLE customers (
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
    console.log('✅ CUSTOMERS table created!');

    console.log('📦 Creating LEADS table...');
    await pool.query(`
      CREATE TABLE leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'New',
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ LEADS table created!');

    console.log('📦 Creating ORDERS table...');
    await pool.query(`
      CREATE TABLE orders (
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
    console.log('✅ ORDERS table created!');

    console.log('📦 Creating ORDER_ITEMS table...');
    await pool.query(`
      CREATE TABLE order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        hsn_code VARCHAR(50),
        quantity INTEGER NOT NULL,
        unit VARCHAR(20) DEFAULT 'Pcs',
        price DECIMAL(10,2) NOT NULL,
        gst_rate DECIMAL(5,2) NOT NULL,
        gst_amount DECIMAL(10,2),
        amount DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('✅ ORDER_ITEMS table created!\n');

    console.log('📊 Verifying CUSTOMERS table columns:');
    const columns = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = 'customers'
      ORDER BY ordinal_position
    `);
    
    columns.rows.forEach(col => {
      console.log(`   ✓ ${col.column_name} (${col.data_type})`);
    });

    console.log('\n🎉 All tables recreated successfully!\n');
    
    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

recreateTables();
