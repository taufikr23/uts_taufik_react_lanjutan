import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import pool from './db.js';
import authenticateToken from './middleware/auth.js';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-uts-react-2026';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test database connection
pool.connect((err) => {
    if (err) {
        console.error('❌ Database connection error:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL database');
    }
});

// ============ AUTHENTICATION ENDPOINTS ============

// Register
app.post('/api/register', async (req, res) => {
    try {
        const { gmail, username, password } = req.body;

        if (!gmail || !username || !password) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        const userExists = await pool.query(
            'SELECT * FROM users WHERE gmail = $1 OR username = $2',
            [gmail, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email atau username sudah terdaftar' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (gmail, username, password) VALUES ($1, $2, $3) RETURNING id, gmail, username',
            [gmail, username, hashedPassword]
        );

        res.status(201).json({ 
            message: 'Registrasi berhasil', 
            user: newUser.rows[0] 
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Login - PERBAIKI BAGIAN INI
app.post('/api/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        console.log('🔐 Login attempt:', identifier);

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        // Cari user
        const user = await pool.query(
            'SELECT * FROM users WHERE gmail = $1 OR username = $1',
            [identifier]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Email/Username atau password salah' });
        }

        // Cek password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email/Username atau password salah' });
        }

        // Buat token JWT
        const token = jwt.sign(
            { 
                id: user.rows[0].id, 
                username: user.rows[0].username, 
                gmail: user.rows[0].gmail 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ Token created:', token.substring(0, 30) + '...');

        // SET COOKIE - PERBAIKI INI
        res.cookie('token', token, {
            httpOnly: false,     // UBAH JADI false biar bisa dibaca JavaScript
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,       // false untuk localhost (http)
            sameSite: 'lax',
            path: '/'
        });

        // Kirim response
        res.json({ 
            message: 'Login berhasil', 
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                gmail: user.rows[0].gmail
            },
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout berhasil' });
});

// Get current user
app.get('/api/me', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query(
            'SELECT id, gmail, username FROM users WHERE id = $1',
            [req.user.id]
        );
        res.json(user.rows[0]);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// ============ MAHASISWA ENDPOINTS ============

// Get all mahasiswa
app.get('/api/mahasiswa', authenticateToken, async (req, res) => {
    try {
        const mahasiswa = await pool.query('SELECT * FROM mhs_tb ORDER BY id');
        res.json(mahasiswa.rows);
    } catch (error) {
        console.error('Get mahasiswa error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Get mahasiswa by id
app.get('/api/mahasiswa/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const mahasiswa = await pool.query('SELECT * FROM mhs_tb WHERE id = $1', [id]);

        if (mahasiswa.rows.length === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }

        res.json(mahasiswa.rows[0]);
    } catch (error) {
        console.error('Get mahasiswa by id error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Create mahasiswa
app.post('/api/mahasiswa', authenticateToken, async (req, res) => {
    try {
        const { name, nim, jurusan, ipk, isActive } = req.body;

        if (!name || !nim || !jurusan || !ipk) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        const nimExists = await pool.query('SELECT * FROM mhs_tb WHERE nim = $1', [nim]);

        if (nimExists.rows.length > 0) {
            return res.status(400).json({ message: 'NIM sudah terdaftar' });
        }

        const newMahasiswa = await pool.query(
            'INSERT INTO mhs_tb (name, nim, jurusan, ipk, isActive) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, nim, jurusan, ipk, isActive !== undefined ? isActive : true]
        );

        res.status(201).json(newMahasiswa.rows[0]);

    } catch (error) {
        console.error('Create mahasiswa error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Update mahasiswa
app.put('/api/mahasiswa/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, nim, jurusan, ipk, isActive } = req.body;

        if (!name || !nim || !jurusan || !ipk) {
            return res.status(400).json({ message: 'Semua field harus diisi' });
        }

        const mahasiswa = await pool.query('SELECT * FROM mhs_tb WHERE id = $1', [id]);

        if (mahasiswa.rows.length === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }

        const nimExists = await pool.query(
            'SELECT * FROM mhs_tb WHERE nim = $1 AND id != $2',
            [nim, id]
        );

        if (nimExists.rows.length > 0) {
            return res.status(400).json({ message: 'NIM sudah digunakan' });
        }

        const updatedMahasiswa = await pool.query(
            'UPDATE mhs_tb SET name = $1, nim = $2, jurusan = $3, ipk = $4, isActive = $5 WHERE id = $6 RETURNING *',
            [name, nim, jurusan, ipk, isActive, id]
        );

        res.json(updatedMahasiswa.rows[0]);

    } catch (error) {
        console.error('Update mahasiswa error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Delete mahasiswa
app.delete('/api/mahasiswa/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const mahasiswa = await pool.query('SELECT * FROM mhs_tb WHERE id = $1', [id]);

        if (mahasiswa.rows.length === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }

        await pool.query('DELETE FROM mhs_tb WHERE id = $1', [id]);

        res.json({ message: 'Mahasiswa berhasil dihapus' });

    } catch (error) {
        console.error('Delete mahasiswa error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Toggle active status
app.patch('/api/mahasiswa/:id/toggle-active', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const mahasiswa = await pool.query('SELECT * FROM mhs_tb WHERE id = $1', [id]);

        if (mahasiswa.rows.length === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }

        const newStatus = !mahasiswa.rows[0].isactive;
        
        const updatedMahasiswa = await pool.query(
            'UPDATE mhs_tb SET isActive = $1 WHERE id = $2 RETURNING *',
            [newStatus, id]
        );

        res.json(updatedMahasiswa.rows[0]);

    } catch (error) {
        console.error('Toggle active error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api`);
});