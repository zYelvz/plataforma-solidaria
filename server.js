const express = require('express');
const { registerUser, loginUser } = require('./authController');

const app = express();
app.use(express.json());

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Servidor de la Plataforma Solidaria corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;