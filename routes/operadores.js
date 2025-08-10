// Importa Express
const express = require('express');
const router = express.Router();

// Importa el controlador centralizado de operadores
const operadorController = require('../controllers/operadorController');

// Importa middlewares de autenticación y control de roles
const middlewareCheckRole = require('../middlewares/checkRole');
const middlewareAuth = require('../middlewares/auth');

// Aplica el middleware de autenticación a todas las rutas de este archivo
router.use(middlewareAuth);

// Aplica el middleware de roles: solo 'admin' puede usar estas rutas
router.use(middlewareCheckRole(['admin']));

// GET /operadores
router.get('/', operadorController.getAll);

// GET /operadores/:codigo
router.get('/:codigo', operadorController.getByCodigo);

// POST /operadores
router.post('/', operadorController.create);

// PUT /operadores/:codigo
router.put('/:codigo', operadorController.update);

// DELETE /operadores/:codigo
router.delete('/:codigo', operadorController.delete);

// Exporta el router para que se pueda usar en app.js o index.js
module.exports = router;
