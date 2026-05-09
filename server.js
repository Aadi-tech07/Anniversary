/**
 * RSVP Backend Server — Mukesh & Abha Singh 25th Anniversary
 * ─────────────────────────────────────────────────────────────
 * Runs locally on YOUR machine only.
 * Guests' RSVPs are sent here and saved to your MySQL database.
 *
 * SETUP STEPS:
 *   1. npm install express mysql2 cors
 *   2. Edit the DB_CONFIG below with your MySQL credentials
 *   3. Run:  node server.js
 *   4. Server starts at http://localhost:3001
 */

const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app  = express();
const PORT = 3001;

/* ══════════════════════════════════════════════════════
   🔧  YOUR MySQL CONFIGURATION — EDIT THIS SECTION
   ══════════════════════════════════════════════════════ */
const DB_CONFIG = {
  host:     'localhost',
  port:     3306,
  user:     'root',
  password: 'Aditya@2027',  // ← PUT YOUR MYSQL PASSWORD HERE
  database: 'anniversary_rsvp',
};
/* ════════════════════════════════════════════════════ */

app.use(cors({ origin: '*' }));   // allows your HTML file to call this API
app.use(express.json());

// ── Create DB + table if they don't exist ─────────────────────
async function initDB() {
  // Connect without specifying database first, so we can create it
  const bootstrapConn = await mysql.createConnection({
    host:     DB_CONFIG.host,
    port:     DB_CONFIG.port,
    user:     DB_CONFIG.user,
    password: DB_CONFIG.password,
  });

  await bootstrapConn.execute(
    `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrapConn.end();

  // Now connect with the database selected
  const conn = await mysql.createConnection(DB_CONFIG);
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS rsvp_guests (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(100) NOT NULL,
      rsvp_time  DATETIME DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(50)
    )
  `);
  await conn.end();
  console.log('✅  Database & table ready.');
}

// ── POST /rsvp  — save a new guest name ───────────────────────
app.post('/rsvp', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const cleanName = name.trim();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const conn = await mysql.createConnection(DB_CONFIG);

    // Check for duplicate (case-insensitive)
    const [rows] = await conn.execute(
      'SELECT id FROM rsvp_guests WHERE LOWER(name) = LOWER(?)',
      [cleanName]
    );

    if (rows.length > 0) {
      await conn.end();
      return res.json({ success: true, duplicate: true, name: cleanName });
    }

    await conn.execute(
      'INSERT INTO rsvp_guests (name, ip_address) VALUES (?, ?)',
      [cleanName, ip]
    );
    await conn.end();

    console.log(`🎉  New RSVP: ${cleanName} (${new Date().toLocaleString()})`);
    res.json({ success: true, duplicate: false, name: cleanName });

  } catch (err) {
    console.error('DB Error:', err.message);
    res.status(500).json({ error: 'Database error. Check server logs.' });
  }
});

// ── GET /guests  — view all RSVPs (only you, running locally) ──
app.get('/guests', async (req, res) => {
  try {
    const conn = await mysql.createConnection(DB_CONFIG);
    const [rows] = await conn.execute(
      'SELECT id, name, rsvp_time FROM rsvp_guests ORDER BY rsvp_time DESC'
    );
    await conn.end();
    res.json({ total: rows.length, guests: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start ──────────────────────────────────────────────────────
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🎊  RSVP Server running at http://localhost:${PORT}`);
      console.log(`📋  View all guests at: http://localhost:${PORT}/guests\n`);
    });
  })
  .catch(err => {
    console.error('❌  Failed to initialize database:', err.message);
    process.exit(1);
  });