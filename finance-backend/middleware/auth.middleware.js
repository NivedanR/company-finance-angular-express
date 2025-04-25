const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if (!header) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token format incorrect' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If the token is expired, send a specific message
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach user to the request object
    next(); // Continue to the next middleware or route handler
  });
};
