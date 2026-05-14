import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    password: 'taufik123', // Ganti dengan password postgres Anda
    host: 'localhost',
    port: 5432,
    database: 'uts_react'
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

export default pool;
