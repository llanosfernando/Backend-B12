// Controlador para autenticación (login)
const db = require('../config/conexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET || 'mipalabrasecreta';

/**
 * Controlador para autenticación (login)
 * Maneja el inicio de sesión y la generación de token JWT.
 */
exports.login = (req, res) => {
  const { correo, contraseña } = req.body;
  if (!correo || !contraseña) {
    return res.status(400).json({ success: false, error: 'Faltan datos: correo y contraseña son obligatorios.' });
  }
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [correo], async (err, results) => {
    if (err) {
      console.error('[Auth] Error al consultar la base de datos:', err);
      return res.status(500).json({ success: false, error: 'No se pudo procesar el login. Intenta más tarde.' });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: `No existe usuario con el correo ${correo}` });
    }
    const usuarioDB = results[0];
    try {
      const contraseñaValida = await bcrypt.compare(contraseña, usuarioDB.password);
      if (!contraseñaValida) {
        return res.status(401).json({ success: false, error: 'Contraseña incorrecta. Verifica tus datos.' });
      }
      const token = jwt.sign(
        { id: usuarioDB.id, email: usuarioDB.email, rol: usuarioDB.rol },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      return res.status(200).json({ success: true, mensaje: 'Inicio de sesión exitoso', token });
    } catch (err) {
      console.error('[Auth] Error al comparar contraseñas:', err);
      return res.status(500).json({ success: false, error: 'No se pudo validar la contraseña. Intenta más tarde.' });
    }
  });
};
