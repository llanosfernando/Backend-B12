// checkRole.js
module.exports = (rolesPermitidos = []) => {
  return (req, res, next) => {
    const userRole = req.user?.rol // req.user viene del middleware auth

    if (!userRole || !rolesPermitidos.includes(userRole)) {
      return res.status(403).json({ error: 'Acceso denegado' })
    }

    next() // Si pasa la validación, sigue a la ruta
  }
}
