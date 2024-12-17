import request from 'supertest';
import app from '../app.js';

describe('Auth Routes', () => {
  let token; // Store the JWT token for reuse in tests

  // Test for user registration
  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'lee@example.com',
          password: 'password123',
          first_name: 'Lee',
          last_name: 'Adorable',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
    });
  });

  // Test for user login
  describe('POST /login', () => {
    it('should login a user successfully with valid credentials', async () => {
      // Ensure the user exists (optional step if already registered in the previous test)
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'funmi@example.com',
          password: 'password123',
          first_name: 'Funmi',
          last_name: 'Jones',
        });

      // Attempt login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'funmi@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();

      // Store the token for the next test
      token = response.body.token;
    });
  });
  describe('GET /protected', () => {
    let token;

    beforeAll(async () => {
        // Register and login to get the token
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'funmi@example.com',
                password: 'password123'
            });
            console.log('Token received:', token);


        token = loginResponse.body.token;
    });

    it('should access a protected route with a valid token', async () => {
        const response = await request(app)
            .get('/api/auth/protected')
            .set('Authorization', `Bearer ${token}`); // Ensure the token is passed

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('You are authorized!');
    });

    it('should deny access to a protected route without a token', async () => {
        const response = await request(app)
            .get('/api/auth/protected');

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Access denied. No token provided.');
    });
});
});