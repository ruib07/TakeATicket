import supertest from 'supertest';

import app from '../src/app.js';

test('Test #1 - Test if it is resolving at the root', () => supertest(app).get('/')
  .then((res) => {
    expect(res.status).toBe(200);
  }));