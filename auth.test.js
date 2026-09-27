const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('./server');
const { usersDB, getSecret } = require('./authController');

// Helpers
const registrar = (datos) => request(app).post('/api/register').send(datos);
const login = (email, password) => request(app).post('/api/login').send({ email, password });

const donante = { nombre: 'Juan', email: 'juan@test.com', password: '123456', rol: 'donante' };
const admin = { nombre: 'Admin', email: 'admin@test.com', password: 'passwordSegura', rol: 'administrador' };

describe('Módulo de Usuarios & Auth', () => {
    beforeEach(() => {
        usersDB.length = 0;
    });

    describe('GET /', () => {
        test('La ruta de salud responde ok', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('ok');
        });
    });

    describe('POST /api/register', () => {
        test('Debe registrar un donante exitosamente', async () => {
            const res = await registrar(donante);
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Usuario registrado exitosamente');
        });

        test('Debe guardar la contraseña encriptada, no en texto plano', async () => {
            await registrar(donante);
            expect(usersDB[0].password).not.toBe(donante.password);
        });

        test('Debe rechazar un registro con rol inválido', async () => {
            const res = await registrar({ ...donante, rol: 'hacker' });
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Rol no válido');
        });

        test('Debe rechazar un registro con campos faltantes', async () => {
            const res = await registrar({ email: 'x@test.com' });
            expect(res.statusCode).toBe(400);
        });

        test('Debe rechazar un registro sin body', async () => {
            const res = await request(app).post('/api/register');
            expect(res.statusCode).toBe(400);
        });

        test('Debe rechazar un email con formato inválido', async () => {
            const res = await registrar({ ...donante, email: 'no-es-un-email' });
            expect(res.statusCode).toBe(400);
        });

        test('Debe rechazar contraseñas de menos de 6 caracteres', async () => {
            const res = await registrar({ ...donante, password: '123' });
            expect(res.statusCode).toBe(400);
        });

        test('Debe rechazar un email duplicado', async () => {
            await registrar(donante);
            const res = await registrar(donante);
            expect(res.statusCode).toBe(409);
        });
    });

    describe('POST /api/login', () => {
        test('Debe iniciar sesión y devolver un JWT con id y rol', async () => {
            await registrar(admin);
            const res = await login(admin.email, admin.password);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');

            const payload = jwt.verify(res.body.token, getSecret());
            expect(payload.rol).toBe('administrador');
        });

        test('Debe responder 404 si el usuario no existe', async () => {
            const res = await login('nadie@test.com', '123456');
            expect(res.statusCode).toBe(404);
        });

        test('Debe responder 401 si la contraseña es incorrecta', async () => {
            await registrar(donante);
            const res = await login(donante.email, 'incorrecta');
            expect(res.statusCode).toBe(401);
        });

        test('Debe responder 400 si faltan email o contraseña', async () => {
            const res = await request(app).post('/api/login').send({ email: 'juan@test.com' });
            expect(res.statusCode).toBe(400);
        });
    });

    describe('Rutas protegidas', () => {
        const obtenerToken = async (usuario) => {
            await registrar(usuario);
            const res = await login(usuario.email, usuario.password);
            return res.body.token;
        };

        test('GET /api/perfil sin token responde 401', async () => {
            const res = await request(app).get('/api/perfil');
            expect(res.statusCode).toBe(401);
        });

        test('GET /api/perfil con token inválido responde 401', async () => {
            const res = await request(app).get('/api/perfil').set('Authorization', 'Bearer token-falso');
            expect(res.statusCode).toBe(401);
        });

        test('GET /api/perfil con token válido devuelve el perfil sin contraseña', async () => {
            const token = await obtenerToken(donante);
            const res = await request(app).get('/api/perfil').set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.email).toBe(donante.email);
            expect(res.body).not.toHaveProperty('password');
        });

        test('GET /api/perfil responde 404 si el usuario ya no existe', async () => {
            const token = await obtenerToken(donante);
            usersDB.length = 0;
            const res = await request(app).get('/api/perfil').set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(404);
        });

        test('GET /api/usuarios con rol donante responde 403', async () => {
            const token = await obtenerToken(donante);
            const res = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(403);
        });

        test('GET /api/usuarios con rol administrador lista los usuarios', async () => {
            await registrar(donante);
            const token = await obtenerToken(admin);
            const res = await request(app).get('/api/usuarios').set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).not.toHaveProperty('password');
        });
    });
});