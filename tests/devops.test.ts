import request from 'supertest';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

// Constants para tests
const BASE_URL = '/devOpsRouter/devOps';
const VALID_API_KEY = 'valid_api_key';

// Creamos un app de Express de prueba
const app = express();
app.use(express.json());

// Mock middleware para no tocar la lógica real
const mockCheckApiKey = (req: Request, res: Response, next: NextFunction) => {
  const key = req.header('x-parse-rest-api-key');
  if (!key) return res.status(401).json({ error: 'Falta api-key' });
  if (key !== VALID_API_KEY) return res.status(403).json({ error: 'Api-key incorrecta' });
  next();
};

const mockCheckHttpMethod = (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });
  next();
};

// Handler de errores local
const handleHttp = (res: Response, error: Error) => {
  res.status(500).json({ error: error.message });
};

// Endpoint de prueba
app.post(BASE_URL, mockCheckApiKey, mockCheckHttpMethod, (req: Request, res: Response) => {
  try {
    const { name, forceError } = req.body;
    if (forceError) throw new Error('Error simulado');
    if (!name) return res.status(400).json({ error: 'Falta name' });
    res.status(200).json({ success: true, data: req.body });
  } catch (error) {
    handleHttp(res, error as Error);
  }
});

// Tests
describe('POST /devOpsRouter/devOps - Test funcional completo', () => {
  it('401 si no se envía api-key', async () => {
    const res = await request(app).post(BASE_URL).send({});
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Falta api-key');
  });

  it('403 si api-key incorrecta', async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set('x-parse-rest-api-key', 'api_key_incorrecta')
      .send({ name: 'test' });
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Api-key incorrecta');
  });

  it('200 si payload correcto', async () => {
    const payload = { name: 'Test', description: 'Descripción' };
    const res = await request(app)
      .post(BASE_URL)
      .set('x-parse-rest-api-key', VALID_API_KEY)
      .send(payload);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toMatchObject(payload);
  });

  it('400 si falta dato obligatorio (payload sin name)', async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set('x-parse-rest-api-key', VALID_API_KEY)
      .send({ description: 'sin name' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'Falta name');
  });

  it('500 si error interno simulado', async () => {
    const res = await request(app)
      .post(BASE_URL)
      .set('x-parse-rest-api-key', VALID_API_KEY)
      .send({ name: 'Test', forceError: true });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Error simulado');
  });
});
