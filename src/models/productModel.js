const Joi = require('joi');

// Define the Product Model Schema
const productSchema = Joi.object({
    product_id: Joi.string().optional(),
    category: Joi.string().required(),
    category_id: Joi.string().required(),
    product_name: Joi.string().required(),
    description: Joi.string().optional(),
    quantity: Joi.number().integer().required(),
    price: Joi.number().required(),
});

module.exports = productSchema;
