const express = require('express');
const path = require('path');
const config = require('./config');
const loggerMiddleware = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/products');

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/products', productRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Сервер успешно запущен на порту ${config.port}`);
});
