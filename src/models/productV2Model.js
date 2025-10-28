const Joi = require('joi');

// Define the Product V2 Model Schema
const productV2Schema = Joi.object({
    product_id: Joi.string().required(),
    product_Name: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    brand_Name: Joi.string().optional().allow(''),
    image_url: Joi.array().items(Joi.string()).optional().default([]),
    mrp: Joi.number().required(),
    is_verified: Joi.boolean().optional().default(false),
    unit: Joi.string().required(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional()
});

module.exports = productV2Schema;