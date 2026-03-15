import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    // Ambil token dari cookie atau header
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
    
    console.log('🔐 Middleware auth.js - Token:', token ? 'ADA' : 'TIDAK ADA');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // VERIFIKASI TOKEN - Gunakan secret yang SAMA dengan di index.js
        const verified = jwt.verify(token, 'your-secret-key-uts-react-2026');
        console.log('✅ Token verified:', verified);
        
        req.user = verified;
        next();
    } catch (error) {
        console.error('❌ Token verification error:', error.message);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

export default authenticateToken;