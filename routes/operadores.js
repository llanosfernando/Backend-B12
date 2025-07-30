const express = require('express');
const router = express.Router();
const conexion = require('../conexion');

router.get('/:codigo', (req, res) => {
  const codigo = req.params.codigo;

  const query = 'SELECT * FROM operadores WHERE codigo = ?';
  conexion.query(query, [codigo], (error, results) => {
    if (error) {
      console.error('Error consultando operador:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Operador no encontrado' });
    }

    res.json(results[0]); // Envía solo un operador
  });
});

module.exports = router;
