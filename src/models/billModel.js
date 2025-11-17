const Joi = require('joi');

// Define the Bill Model Schema
const billSchema = Joi.object({
    bill_id: Joi.string().required(),
    bill_no: Joi.string().required(),
    date: Joi.string().required(),
    customer_name: Joi.string().optional().allow(''),
    phoneNo: Joi.string().optional().allow(''),
    items: Joi.array().items(Joi.object({
        item_name: Joi.string().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required()
    })).required(),
    subtotal: Joi.number().required(),
    taxes: Joi.number().optional(),
    total: Joi.number().required(),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional()
});

module.exports = billSchema;