const Joi = require('joi');

// Define the Vendor-Product Model Schema
const vendorProductSchema = Joi.object({
    vendor_id: Joi.string().required(),
    product_id: Joi.string().required(),
    product_Name: Joi.string().required(),
    brand_Name: Joi.string().required(),
    image_url: Joi.array().items(Joi.string()).optional().default([]),
    sell_price: Joi.number().required(),
    mrp: Joi.number().required(),
    unit: Joi.string().required(),
    discount_percentage: Joi.number().optional(),
    is_active: Joi.boolean().optional().default(false),
    is_deleted: Joi.boolean().optional().default(false),
    quantity: Joi.number().required(),
    createdAt: Joi.string().optional().default(() => new Date().toISOString()),
    updatedAt: Joi.string().optional().default(() => new Date().toISOString()),
    description: Joi.string().optional(),
    isVerified: Joi.boolean().optional().default(false)
    
});
module.exports = vendorProductSchema;