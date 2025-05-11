const Joi = require('joi');

// Define the Category Model Schema
const categorySchema = Joi.object({
    categoryId: Joi.string().optional(),
    name: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    subCategories: Joi.array().items(Joi.string()).optional(),
});

module.exports = categorySchema;
