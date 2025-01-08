import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        const errorMessage = process.env.NODE_ENV === 'production' ? 'Invalid token' : err.message;
        return res.status(403).json({ message: errorMessage });
    }
};

