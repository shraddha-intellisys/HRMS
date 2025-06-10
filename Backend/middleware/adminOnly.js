module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // ✅ Admin is authorized
  }
  return res.status(403).json({ message: '❌ Access denied. Admins only.' });
};
