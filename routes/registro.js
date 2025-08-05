const express = require('express'); 
const router = express.Router();
const conexion = require('../config/conexion');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación de datos
  if (!nombre || !email || !password) {
    console.log('Datos recibidos incompletos:', req.body);
    return res.status(400).json({ mensaje: 'Faltan datos' });
  }

  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Consulta SQL
    const consulta = 'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)';
    conexion.query(consulta, [nombre, email, hashedPassword], (error, resultados) => {
      if (error) {
        console.error('Error al insertar en MySQL:', error);
        return res.status(500).json({ mensaje: 'Error al registrar el usuario' });
      }
      res.status(201).json({ mensaje: 'Usuario registrado con éxito' });
    });
  } catch (error) {
    console.error('Error al encriptar contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

module.exports = router;
