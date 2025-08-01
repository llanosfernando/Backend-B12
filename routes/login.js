const express = require('express'); // ✅ Importar express para manejar rutas
const router = express.Router(); // ✅ Importar express y crear un router
const db = require('../config/conexion'); // ✅ Conexión correcta
const bcrypt = require('bcrypt'); // ✅ Importar bcrypt para manejar contraseñas
const jwt = require('jsonwebtoken'); // ✅ Importar JWT para manejar tokens


const  JWT_SECRET = process.env.JWT_SECRET|| 'mipalabrasecreta'; // ✅ Clave secreta para JWT, se puede configurar en el entorno
// ---------------------------------------------
// RUTA: POST /login
// Procesa la solicitud de inicio de sesión
// ---------------------------------------------
router.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos'
    });
  }

  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(sql, [correo], async (err, results) => {
    if (err) {
      console.error('❌ Error al consultar la base de datos:', err);
      return res.status(500).json({
        success: false,
        error: 'Error del servidor'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Correo no encontrado'
      });
    }

    const usuarioDB = results[0];

    try {
      const contraseñaValida = await bcrypt.compare(contraseña, usuarioDB.password);

      if (!contraseñaValida) {
        return res.status(401).json({
          success: false,
          error: 'Contraseña incorrecta'
        });
      }
      //console.log('Usuario logueado:', usuarioDB); // ✅ Logueo del usuario para hacer pruebas en consola
      const token = jwt.sign(
        { id: usuarioDB.id, email: usuarioDB.email, rol: usuarioDB.rol },
        JWT_SECRET,
        { expiresIn: '1h' } // El token expirará en 1 hora
      );

      return res.status(200).json({
        success: true,
        mensaje: 'Inicio de sesión exitoso',
        token
      });

    } catch (err) {
      console.error('❌ Error al comparar contraseñas:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al validar la contraseña'
      });
    }
  });
});

module.exports = router;
