const Joi = require('joi');

// Define the Shop Model Schema
const shopSchema = Joi.object({
    shopId: Joi.string().optional(),
    pincode: Joi.string().optional(),
    rating: Joi.string().optional(),
    contactNumber: Joi.string().optional(),
    address: Joi.string().optional(),
    shopName: Joi.string().optional(),
    ownerName: Joi.string().optional(),
    subcategory: Joi.string().optional(),
    city: Joi.string().optional(),
    longitude: Joi.string().optional(),
    shopStatus: Joi.string().optional(),
    reviewsCount: Joi.string().optional(),
    category: Joi.string().optional(),
    gstNumber: Joi.string().optional(),
    latitude: Joi.string().optional(),
});

module.exports = shopSchema;
