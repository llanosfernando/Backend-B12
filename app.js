require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const conexion = require('./config/conexion');
const login = require('./routes/login');
const operadorRoutes = require('./routes/operadores');
const rutaRegistro = require('./routes/registro');  

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

