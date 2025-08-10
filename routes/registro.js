const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// POST /registro
router.post('/', usuarioController.registro);

module.exports = router;
