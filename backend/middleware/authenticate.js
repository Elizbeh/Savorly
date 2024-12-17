import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        req.user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        console.error('Invalid token', err);
        return res.status(403).json({ message: 'Invalid token' });
    }
};
