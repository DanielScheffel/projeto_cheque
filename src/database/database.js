import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL conectado com sucesso!");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar no MySQL:", error.message);
  }
})();

export default pool;