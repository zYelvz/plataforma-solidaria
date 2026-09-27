require('dotenv').config();
const express = require('express');
const { registerUser, loginUser, getProfile, listUsers } = require('./authController');
const { verifyToken, requireRole } = require('./authMiddleware');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

// Ruta de salud (para comprobar que el despliegue está vivo)
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', servicio: 'Plataforma Solidaria API' });
});

// Rutas públicas
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);

// Rutas protegidas
app.get('/api/perfil', verifyToken, getProfile);
app.get('/api/usuarios', verifyToken, requireRole('administrador'), listUsers);

/* istanbul ignore next */
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor de la Plataforma Solidaria corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;