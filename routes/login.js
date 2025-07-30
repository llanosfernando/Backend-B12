// Importamos Express y creamos un enrutador
const express = require('express');
const router = express.Router();

// Importamos la conexión a la base de datos
const db = require('./conexion'); // Archivo donde está la conexión a MySQL

// Importamos bcrypt para poder comparar contraseñas encriptadas
const bcrypt = require('bcrypt');

// ---------------------------------------------
// RUTA: POST /login
// Procesa la solicitud de inicio de sesión
// ---------------------------------------------
router.post('/login', (req, res) => {
  // Extraemos correo y contraseña del cuerpo de la petición (frontend debe enviarlos así)
  const { correo, contraseña } = req.body;

  // Validamos que ambos campos estén presentes
  if (!correo || !contraseña) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos' // Devuelve error si algún campo está vacío
    });
  }

  // SQL: Buscamos al usuario en la base de datos usando el email
  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  // Ejecutamos la consulta SQL
  db.query(sql, [correo], async (err, results) => {
    // Si hay un error al consultar la base de datos
    if (err) {
      console.error('❌ Error al consultar la base de datos:', err);
      return res.status(500).json({
        success: false,
        error: 'Error del servidor' // Error interno
      });
    }

    // Si no se encuentra ningún usuario con ese correo
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Correo no encontrado'
      });
    }

    // Si se encontró un usuario, lo guardamos en una variable
    const usuarioDB = results[0];

    try {
      // Comparamos la contraseña enviada con la encriptada que está en la base de datos
      const contraseñaValida = await bcrypt.compare(contraseña, usuarioDB.password);

      // Si la contraseña NO es válida
      if (!contraseñaValida) {
        return res.status(401).json({
          success: false,
          error: 'Contraseña incorrecta'
        });
      }

      // Si todo está bien, se devuelve un mensaje de éxito
      return res.status(200).json({
        success: true,
        mensaje: 'Inicio de sesión exitoso'
      });

    } catch (err) {
      // Si hubo un error al comparar las contraseñas
      console.error('❌ Error al comparar contraseñas:', err);
      return res.status(500).json({
        success: false,
        error: 'Error al validar la contraseña'
      });
    }
  });
});

// Exportamos el router para que pueda usarse en app.js o index.js
module.exports = router;
