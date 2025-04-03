import jwt from 'jsonwebtoken'; 

export const authenticate = (req, res, next) => {
  // Extract token from the cookies
  const token = req.cookies.authToken;
  
  // If there's no token, return an unauthorized error
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token is missing' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token has expired, please request a new one.' });
      }
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Attach user data to the request object
    req.user = decoded;
    next();
  });
};
