require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const conexion = require('./conexion');
const login = require('./login');

app.use(cors());  // permite que el frontend se conecte
app.use(express.json());   // permite recibir JSON
app.use('/', login); // Aquí montamos la ruta del login

// Conexión a MySQL
conexion.connect((error) => {
  if (error) {
    console.error('Error al conectar a MySQL:', error);
    return;
  }
  console.log('Conectado a MySQL correctamente.');
});

// Importar y usar la ruta de registro
const rutaRegistro = require('./registro');
app.use('/', rutaRegistro); // Aquí es donde montamos la ruta

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

