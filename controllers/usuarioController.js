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
  const query = 'SELECT id, nombre, email, rol FROM usuarios';
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
  const query = 'SELECT id, nombre, email, rol FROM usuarios WHERE id = ?';
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
  const { nombre, email, password, rol } = req.body;
  let fields = [];
  let params = [];

  if (nombre) {
    fields.push('nombre = ?');
    params.push(nombre);
  }
  if (email) {
    fields.push('email = ?');
    params.push(email);
  }
  if (rol !== undefined) {
    fields.push('rol = ?');
    params.push(rol);
  }

  if (password) {
    // Si se envía password, se encripta y actualiza
    bcrypt.hash(password, 10).then(hashedPassword => {
      fields.push('password = ?');
      params.push(hashedPassword);
      const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
      params.push(id);
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
    // Si no se envía password, solo actualiza los campos enviados
    const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);
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

/**
 * Registrar un nuevo usuario
 * POST /usuarios
 */
exports.registro = (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios: nombre, email, password, rol.' });
  }

  bcrypt.hash(password, 10).then(hashedPassword => {
    const query = 'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
    const params = [nombre, email, hashedPassword, rol];

    conexion.query(query, params, (error, result) => {
      if (error) {
        console.error('[Usuarios] Error registrando usuario:', error);
        return res.status(500).json({ error: 'No se pudo registrar el usuario. Intenta más tarde.' });
      }
      res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: result.insertId });
    });
  });
};
