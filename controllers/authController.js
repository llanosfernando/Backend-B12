
// Controlador para autenticación (login)
const db = require('../config/conexion');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET || 'mipalabrasecreta';





/**
 * Registrar un nuevo usuario
 * POST /auth/registro
 */
exports.registro = async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ mensaje: 'Faltan datos: nombre, email y password son obligatorios.' });
  }
  try {
    const checkQuery = 'SELECT id FROM usuarios WHERE email = ? LIMIT 1';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error('[Registro] Error al verificar usuario:', err);
        return res.status(500).json({ mensaje: 'No se pudo verificar el usuario. Intenta más tarde.' });
      }
      if (results.length > 0) {
        return res.status(400).json({ mensaje: `El correo ${email} ya está registrado.` });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const insertQuery = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
      db.query(insertQuery, [nombre, email, hashedPassword], (insertErr) => {
        if (insertErr) {
          console.error('[Registro] Error al insertar en MySQL:', insertErr);
          return res.status(500).json({ mensaje: 'No se pudo registrar el usuario. Intenta más tarde.' });
        }
        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
      });
    });
  } catch (error) {
    console.error('[Registro] Error general en registro:', error);
    res.status(500).json({ mensaje: 'No se pudo registrar el usuario. Intenta más tarde.' });
  }
};






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
