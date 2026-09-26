const request = require('supertest');
const app = require('./server');
const { usersDB } = require('./authController');

describe('Módulo de Usuarios & Auth', () => {
    beforeEach(() => {
        usersDB.length = 0; 
    });

    test('Debe registrar un donante exitosamente', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ nombre: 'Juan', email: 'juan@test.com', password: '123', rol: 'donante' });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toBe("Usuario registrado exitosamente");
    });

    test('Debe rechazar un registro con rol inválido', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ nombre: 'Ana', email: 'ana@test.com', password: '123', rol: 'hacker' });

        expect(res.statusCode).toEqual(400);
    });

    test('Debe iniciar sesión y devolver un JWT', async () => {
        await request(app)
            .post('/api/register')
            .send({ nombre: 'Admin', email: 'admin@test.com', password: 'passwordSegura', rol: 'administrador' });

        const res = await request(app)
            .post('/api/login')
            .send({ email: 'admin@test.com', password: 'passwordSegura' });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });
});