const express = require('express');
const swaggerUi = require('swagger-ui-express');
import swaggerSpec from './swagger';

const app = express();

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World!' });
});

module.exports = app;
