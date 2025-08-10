
/**
 * Controlador centralizado para operadores
 * Cada función maneja una operación CRUD y responde con mensajes claros.
 */
const conexion = require('../config/conexion');

/**
 * Obtener todos los operadores
 * GET /operadores
 */
exports.getAll = (req, res) => {
  const query = 'SELECT * FROM operadores';
  conexion.query(query, (error, results) => {
    if (error) {
      console.error('[Operadores] Error consultando operadores:', error);
      return res.status(500).json({ error: 'No se pudo obtener los operadores. Intenta más tarde.' });
    }
    res.json(results);
  });
};

/**
 * Obtener un operador por código
 * GET /operadores/:codigo
 */
exports.getByCodigo = (req, res) => {
  const codigo = req.params.codigo;
  const query = 'SELECT * FROM operadores WHERE codigo = ?';
  conexion.query(query, [codigo], (error, results) => {
    if (error) {
      console.error(`[Operadores] Error consultando operador (${codigo}):`, error);
      return res.status(500).json({ error: 'No se pudo obtener el operador. Intenta más tarde.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: `No existe operador con código ${codigo}` });
    }
    res.json(results[0]);
  });
};

/**
 * Crear un nuevo operador
 * POST /operadores
 */
exports.create = (req, res) => {
  const { codigo, nombres, apellidos, cedula, cargo, foto } = req.body;
  if (!codigo || !nombres || !apellidos || !cedula || !cargo) {
    return res.status(400).json({ error: 'Faltan datos obligatorios: codigo, nombres, apellidos, cedula, cargo.' });
  }
  const query = 'INSERT INTO operadores (codigo, nombres, apellidos, cedula, cargo, foto) VALUES (?, ?, ?, ?, ?, ?)';
  conexion.query(query, [codigo, nombres, apellidos, cedula, cargo, foto], (error, result) => {
    if (error) {
      console.error('[Operadores] Error insertando operador:', error);
      return res.status(500).json({ error: 'No se pudo crear el operador. Revisa los datos e intenta más tarde.' });
    }
    res.status(201).json({ mensaje: 'Operador creado correctamente', id: result.insertId });
  });
};

/**
 * Actualizar un operador existente
 * PUT /operadores/:codigo
 */
exports.update = (req, res) => {
  const codigo = req.params.codigo;
  const { nombres, apellidos, cedula, cargo, foto } = req.body;
  const query = 'UPDATE operadores SET nombres = ?, apellidos = ?, cedula = ?, cargo = ?, foto = ? WHERE codigo = ?';
  conexion.query(query, [nombres, apellidos, cedula, cargo, foto, codigo], (error, result) => {
    if (error) {
      console.error(`[Operadores] Error actualizando operador (${codigo}):`, error);
      return res.status(500).json({ error: 'No se pudo actualizar el operador. Intenta más tarde.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `No existe operador con código ${codigo}` });
    }
    res.json({ mensaje: 'Operador actualizado correctamente' });
  });
};

/**
 * Eliminar un operador
 * DELETE /operadores/:codigo
 */
exports.delete = (req, res) => {
  const codigo = req.params.codigo;
  const query = 'DELETE FROM operadores WHERE codigo = ?';
  conexion.query(query, [codigo], (error, result) => {
    if (error) {
      console.error(`[Operadores] Error eliminando operador (${codigo}):`, error);
      return res.status(500).json({ error: 'No se pudo eliminar el operador. Intenta más tarde.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `No existe operador con código ${codigo}` });
    }
    res.json({ mensaje: 'Operador eliminado correctamente' });
  });
};
