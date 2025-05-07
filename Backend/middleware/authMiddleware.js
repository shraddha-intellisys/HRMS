const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log("🔍 Debug - Authorization Header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("🚨 Missing or malformed Authorization header");
      return res.status(401).json({ message: '❌ Access denied. No token provided.' });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.warn("🚨 No token found after 'Bearer'");
      return res.status(401).json({ message: '❌ Invalid token format.' });
    }

    console.log("🔍 Debug - Extracted Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error("❌ Authentication Error:", err);

        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: '❌ Token expired. Please log in again.' });
        } else if (err.name === "JsonWebTokenError") {
          return res.status(401).json({ message: '❌ Invalid token.' });
        } else {
          return res.status(500).json({ message: '❌ Internal server error during authentication.' });
        }
      }

      console.log("✅ Token Verified - Decoded Payload:", decoded);
      
      // Set userId directly for convenience
      req.user = {
        userId: decoded.userId
      };

      next();
    });

  } catch (error) {
    console.error("❌ Unexpected Authentication Error:", error);
    return res.status(500).json({ message: '❌ Internal server error during authentication.' });
  }
};
