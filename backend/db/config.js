require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)  NOT NULL,
    email      VARCHAR(150)  NOT NULL,
    subject    VARCHAR(200)  NOT NULL,
    message    TEXT          NOT NULL,
    created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
  )
`;

async function initTable() {
  const connection = await pool.getConnection();
  try {
    await connection.query(CREATE_TABLE_SQL);
    console.log("contact_messages table is ready");
  } finally {
    connection.release();
  }
}

async function insertMessage({ name, email, subject, message }) {
  const [result] = await pool.execute(
    `INSERT INTO contact_messages (name, email, subject, message)
     VALUES (:name, :email, :subject, :message)`,
    { name, email, subject, message }
  );
  return result.insertId;
}

module.exports = { pool, initTable, insertMessage };
