import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  console.log('Cookies:', req.cookies);  // Log the cookies

  // Get the token from the cookie
  const token = req.cookies?.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token is missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: 'Invalid token.' });
    }

    // Attach user info to the request for future use
    req.user = {
      id: decoded.userId,      // Ensure this matches how the token was signed
      email: decoded.email,
      role: decoded.role
    };

    console.log("Decoded User Info:", req.user);  // Log the decoded user info for debugging

    // Continue to the next middleware or route handler
    next();
  });
};

