const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

let usersDB = []; 
const SECRET_KEY = "tu_clave_secreta_super_segura";

const registerUser = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    
    if (!['donante', 'beneficiario', 'administrador'].includes(rol)) {
        return res.status(400).json({ error: "Rol no válido" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = { id: usersDB.length + 1, nombre, email, password: hashedPassword, rol };
    usersDB.push(newUser);

    res.status(201).json({ message: "Usuario registrado exitosamente" });
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = usersDB.find(u => u.email === email);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, rol: user.rol }, SECRET_KEY, { expiresIn: '2h' });
    
    res.status(200).json({ token });
};

module.exports = { registerUser, loginUser, usersDB };