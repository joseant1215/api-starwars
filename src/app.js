// src/app.js
import express from 'express';
import bodyParser from 'body-parser';
import { handler as createCharacterHandler } from './handlers/createCharacter';
import { handler as getCharactersHandler } from './handlers/getCharacters';

const app = express();
app.use(bodyParser.json()); // Middleware para analizar JSON

// Middleware para adaptar las solicitudes a Lambda
const lambdaMiddleware = (handler) => async (req, res) => {
  const event = {
    body: JSON.stringify(req.body),
    httpMethod: req.method,
    path: req.path,
    headers: req.headers,
    queryStringParameters: req.query,
  };

  const result = await handler(event);

  res.status(result.statusCode).json(JSON.parse(result.body));
};

// Define tus rutas aquí usando el middleware
app.post('/characters', lambdaMiddleware(createCharacterHandler));
app.get('/characters', lambdaMiddleware(getCharactersHandler));

export default app; // Exporta tu aplicación