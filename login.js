const express = require('express');
const router = express.Router();
const db = require('./conexion'); // Archivo de conexión a MySQL
const bcrypt = require('bcrypt');

// Ruta para procesar el login
router.post('/login', (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificamos si los campos fueron enviados
  if (!correo || !contraseña) {
    return res.status(400).json({ success: false, error: 'Faltan datos' });
  }

  // Buscamos el usuario por su email (no por "correo" ni "usuario")
  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(sql, [correo], async (err, results) => {
    if (err) {
      console.error('❌ Error al consultar la base de datos:', err);
      return res.status(500).json({ success: false, error: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Correo no encontrado' });
    }

    const usuarioDB = results[0];

    // Validamos la contraseña contra el hash de la base de datos
    try {
      const contraseñaValida = await bcrypt.compare(contraseña, usuarioDB.password);

      if (!contraseñaValida) {
        return res.status(401).json({ success: false, error: 'Contraseña incorrecta' });
      }

      // Inicio de sesión exitoso
      return res.status(200).json({ success: true, mensaje: 'Inicio de sesión exitoso' });
    } catch (err) {
      console.error('❌ Error al comparar contraseñas:', err);
      return res.status(500).json({ success: false, error: 'Error al validar la contraseña' });
    }
  });
});

module.exports = router;
