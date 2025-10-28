const Joi = require('joi');

// Define the Vendor-Product Model Schema
const vendorProductSchema = Joi.object({
    vendor_id: Joi.string().required(),
    product_id: Joi.string().required(),
    sell_price: Joi.number().required(),
    discount_percentage: Joi.number().optional(),
    is_active: Joi.boolean().optional().default(false),
    is_deleted: Joi.boolean().optional().default(false),
    quantity: Joi.number().required(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional() 
});

module.exports = vendorProductSchema;