

/**
 * Controlador para usuarios
 * Maneja la creación, consulta, edición y eliminación de usuarios.
 */
const conexion = require('../config/conexion');
const bcrypt = require('bcrypt');


/**
 * Listar todos los usuarios
 * GET /usuarios
 */
exports.getAll = (req, res) => {
  const query = 'SELECT id, nombre, email FROM usuarios';
  conexion.query(query, (error, results) => {
    if (error) {
      console.error('[Usuarios] Error consultando usuarios:', error);
      return res.status(500).json({ error: 'No se pudo obtener los usuarios. Intenta más tarde.' });
    }
    res.json(results);
  });
};

/**
 * Obtener un usuario por ID
 * GET /usuarios/:id
 */
exports.getById = (req, res) => {
  const id = req.params.id;
  const query = 'SELECT id, nombre, email FROM usuarios WHERE id = ?';
  conexion.query(query, [id], (error, results) => {
    if (error) {
      console.error(`[Usuarios] Error consultando usuario (${id}):`, error);
      return res.status(500).json({ error: 'No se pudo obtener el usuario. Intenta más tarde.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: `No existe usuario con id ${id}` });
    }
    res.json(results[0]);
  });
};

/**
 * Editar un usuario
 * PUT /usuarios/:id
 */
exports.update = (req, res) => {
  const id = req.params.id;
  const { nombre, email, password } = req.body;
  let query, params;
  if (password) {
    // Si se envía password, se encripta
    bcrypt.hash(password, 10).then(hashedPassword => {
      query = 'UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?';
      params = [nombre, email, hashedPassword, id];
      conexion.query(query, params, (error, result) => {
        if (error) {
          console.error(`[Usuarios] Error actualizando usuario (${id}):`, error);
          return res.status(500).json({ error: 'No se pudo actualizar el usuario. Intenta más tarde.' });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: `No existe usuario con id ${id}` });
        }
        res.json({ mensaje: 'Usuario actualizado correctamente' });
      });
    });
  } else {
    // Si no se envía password, solo actualiza nombre y email
    query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    params = [nombre, email, id];
    conexion.query(query, params, (error, result) => {
      if (error) {
        console.error(`[Usuarios] Error actualizando usuario (${id}):`, error);
        return res.status(500).json({ error: 'No se pudo actualizar el usuario. Intenta más tarde.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: `No existe usuario con id ${id}` });
      }
      res.json({ mensaje: 'Usuario actualizado correctamente' });
    });
  }
};

/**
 * Eliminar un usuario
 * DELETE /usuarios/:id
 */
exports.delete = (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM usuarios WHERE id = ?';
  conexion.query(query, [id], (error, result) => {
    if (error) {
      console.error(`[Usuarios] Error eliminando usuario (${id}):`, error);
      return res.status(500).json({ error: 'No se pudo eliminar el usuario. Intenta más tarde.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `No existe usuario con id ${id}` });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
};

//
