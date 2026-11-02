const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('electronics', 'clothing', 'food', 'other').required(),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().max(500).optional()
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  price: Joi.number().positive().optional(),
  category: Joi.string().valid('electronics', 'clothing', 'food', 'other').optional(),
  stock: Joi.number().integer().min(0).optional(),
  description: Joi.string().max(500).optional()
});

const getProductsQuerySchema = Joi.object({
  category: Joi.string().valid('electronics', 'clothing', 'food', 'other').optional(),
  minPrice: Joi.number().positive().optional(),
  maxPrice: Joi.number().positive().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        details: error.details.map(err => err.message)
      });
    }
    next();
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        details: error.details.map(err => err.message)
      });
    }
    req.query = value;
    next();
  };
};

module.exports = {
  validateBody,
  validateQuery,
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema
};
