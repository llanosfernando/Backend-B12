const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // tu secret en .env
    req.user = decoded; // Guarda la info del usuario
    next(); // Pasa al siguiente middleware o controlador
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};
