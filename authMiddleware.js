const jwt = require('jsonwebtoken');
const { getSecret } = require('./authController');

// Verifica que la peticion traiga un JWT válido en el header:
// Authorization: Bearer <token>
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const [tipo, token] = authHeader.split(' ');

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    try {
        req.user = jwt.verify(token, getSecret());
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};


// Middleware para verificar que el usuario tenga uno de los roles permitidos
const requireRole = (...rolesPermitidos) => (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
        return res.status(403).json({ error: 'No tienes permisos para acceder a este recurso' });
    }
    next();
};

module.exports = { verifyToken, requireRole };
