import jwt from 'jsonwebtoken';
import logger from '../config/logger.js'; 

export const authenticate = (req, res, next) => {
  logger.info('Request received for authentication');  // Log the start of the authentication process

  // Log the cookies for debugging (but avoid logging sensitive data in production)
  logger.debug('Cookies:', req.cookies);

  // Get the token from the cookie
  const token = req.cookies?.authToken;

  if (!token) {
    logger.warn('Unauthorized attempt - Token is missing');  // Log warning if the token is missing
    return res.status(401).json({ message: 'Unauthorized, token is missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.error('JWT Error: ' + err.message);  // Log JWT verification error
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Attach user info to the request for future use
    req.user = {
      id: decoded.userId, 
      email: decoded.email,
      role: decoded.role
    };

    logger.info('Token successfully verified');  // Log that token was verified successfully
    logger.debug('Decoded User Info:', req.user);  // Log the decoded user info for debugging purposes

    // Continue to the next middleware or route handler
    next();
  });
};
