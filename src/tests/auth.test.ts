import { hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { describe } from 'node:test';

describe('Authentication Flow', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'Test123!@#',
    name: 'Test User',
  };

  beforeAll(async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });

    // Create test user
    const hashedPassword = await hashPassword(testUser.password);
    await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        name: testUser.name,
      },
    });
  });

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  describe('Registration', () => {
    it('should register a new user', async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'NewUser123!@#',
          name: 'New User',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.user).toHaveProperty('id');
      expect(data.user.email).toBe('newuser@example.com');
      expect(data.user.name).toBe('New User');
    });

    it('should not register with existing email', async () => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: 'Test123!@#',
          name: 'Test User',
        }),
      });

      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toBe('User already exists');
    });
  });

  describe('Login', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.user).toHaveProperty('id');
      expect(data.user.email).toBe(testUser.email);
      expect(data.user.name).toBe(testUser.name);
    });

    it('should not login with invalid credentials', async () => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: 'wrongpassword',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid credentials');
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid session', async () => {
      // First login to get session
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      });

      const { user } = await loginResponse.json();
      const cookies = loginResponse.headers.get('set-cookie');

      // Try accessing protected route
      const response = await fetch('/api/trees', {
        headers: {
          Cookie: cookies || '',
        },
      });

      expect(response.status).toBe(200);
    });

    it('should not access protected route without session', async () => {
      const response = await fetch('/api/trees');
      expect(response.status).toBe(401);
    });
  });

  describe('Logout', () => {
    it('should logout successfully', async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
