const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// "Base de datos" en memoria se borra al reiniciar el servidor
const usersDB = [];

const ROLES_VALIDOS = ['donante', 'beneficiario', 'administrador'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getSecret = () => process.env.JWT_SECRET || 'clave_solo_para_desarrollo';

const registerUser = async (req, res) => {
    const { nombre, email, password, rol } = req.body || {};

    if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, password y rol' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'El email no tiene un formato válido' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    if (!ROLES_VALIDOS.includes(rol)) {
        return res.status(400).json({ error: 'Rol no válido' });
    }

    if (usersDB.some(u => u.email === email)) {
        return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: usersDB.length + 1, nombre, email, password: hashedPassword, rol };
    usersDB.push(newUser);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const user = usersDB.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, rol: user.rol }, getSecret(), { expiresIn: '2h' });

    res.status(200).json({ token });
};

// GET /api/perfil -> cualquier usuario con un token valido puede acceder a su propio perfil
const getProfile = (req, res) => {
    const user = usersDB.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { password, ...datosPublicos } = user;
    res.status(200).json(datosPublicos);
};

// GET /api/usuarios -> solo administrador
const listUsers = (req, res) => {
    const usuarios = usersDB.map(({ password, ...datosPublicos }) => datosPublicos);
    res.status(200).json(usuarios);
};

module.exports = { registerUser, loginUser, getProfile, listUsers, usersDB, getSecret };
