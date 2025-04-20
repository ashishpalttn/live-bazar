const Joi = require('joi');

// Define the Shop Model Schema
const shopSchema = Joi.object({
    shopId: Joi.string().optional(),
    shopName: Joi.string().optional(),
    shopOwner: Joi.string().optional(),
    shopType: Joi.string().optional(),
    shopAddress: Joi.string().optional(),
    shopLiveLocation: Joi.string().optional(),
    shopCity: Joi.string().optional(),
    shopState: Joi.string().optional(),
    shopCountry: Joi.string().optional(),
    shopPinCode: Joi.string().optional(),
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

module.exports = shopSchema;
