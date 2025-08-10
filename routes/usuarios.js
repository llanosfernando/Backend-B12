const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Listar todos los usuarios
router.get('/', usuarioController.getAll);

// Obtener un usuario por ID
router.get('/:id', usuarioController.getById);

// Editar un usuario
router.put('/:id', usuarioController.update);

// Eliminar un usuario
router.delete('/:id', usuarioController.delete);

// Registrar un nuevo usuario
//router.post('/', usuarioController.registro);

module.exports = router;


