const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  validateBody, 
  validateQuery, 
  createProductSchema, 
  updateProductSchema, 
  getProductsQuerySchema 
} = require('../middleware/validate');

let products = [];
let currentId = 1;

router.get('/', validateQuery(getProductsQuerySchema), (req, res) => {
  const { category, minPrice, maxPrice, page, limit } = req.query;
  let filtered = [...products];

  if (category) filtered = filtered.filter(p => p.category === category);
  if (minPrice !== undefined) filtered = filtered.filter(p => p.price >= minPrice);
  if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= maxPrice);

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const data = filtered.slice(startIndex, startIndex + limit);

  res.json({ data, total, page, limit });
});

router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  res.json(product);
});

router.post('/', validateBody(createProductSchema), (req, res) => {
  const newProduct = {
    id: currentId++,
    ...req.body,
    imageUrl: null,
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

router.put('/:id', validateBody(createProductSchema), (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

router.patch('/:id', validateBody(updateProductSchema), (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });

  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

router.delete('/:id', (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Товар не найден' });

  products.splice(index, 1);
  res.status(204).send();
});

router.post('/:id/image', upload.single('image'), (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Товар не найден' });
  if (!req.file) return res.status(400).json({ error: 'Файл не загружен' });

  product.imageUrl = `/uploads/products/${req.file.filename}`;
  res.json(product);
});

module.exports = router;
