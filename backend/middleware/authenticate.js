import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
  console.log('Authorization header:', req.headers['authorization']); // Log the header
  
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token is missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = {
      id: decoded.userId,      // Keep consistent with how you sign the token
      email: decoded.email,
      role: decoded.role
    };

    next();
  });
};
