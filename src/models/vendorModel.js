const Joi = require('joi');

// Define the Vendor Model Schema
const vendorSchema = Joi.object({
    vendor_id: Joi.string().optional(),
    shop_name: Joi.string().optional(),
    owner_name: Joi.string().optional(),
    phone_no: Joi.string().optional(),
    email: Joi.string().optional(),
    category: Joi.string().optional(),
    category_code: Joi.string().optional(),
    subcategory: Joi.string().optional(),
    subcategory_code: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    pin_code: Joi.string().optional(),
    state: Joi.string().optional(),
    longitude: Joi.string().optional(),
    latitude: Joi.string().optional(),
    status: Joi.string().optional(),
    review: Joi.string().optional(),
});

module.exports = vendorSchema;
