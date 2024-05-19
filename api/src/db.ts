import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'hipages_user',
  password: 'hellopages',
  database: 'hipages',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
