require('dotenv').config();// Cargar variables de entorno desde .env
const express = require('express');// Importamos express
const cors = require('cors');// Permite que el frontend se conecte
const app = express(); // Inicializamos express
const conexion = require('./config/conexion');// Configuración de conexión a MySQL
const login = require('./routes/login');  // Ruta de login
const operadorRoutes = require('./routes/operadores');// Rutas de operadores
const rutaRegistro = require('./routes/registro');  // Ruta de registro

app.use(cors());  // permite que el frontend se conecte
app.use(express.json());   // permite recibir JSON
app.use('/', login); // Aquí montamos la ruta del login
app.use('/operadores', operadorRoutes); // Aquí montamos la ruta del operador
app.use('/registro', rutaRegistro); // Aquí montamos la ruta de registro

// Conexión a MySQL
conexion.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL:', error);
    return;
  }
  console.log('Conectado a MySQL correctamente.');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

