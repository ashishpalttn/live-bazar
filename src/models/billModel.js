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
        quantity: Joi.string().optional().allow(''),
        price: Joi.string().required().allow('')
    })).required(),
    subtotal: Joi.string().required(),
    taxes: Joi.string().optional().allow(''),
    total: Joi.string().optional().allow(''),
    createdAt: Joi.string().optional(),
    updatedAt: Joi.string().optional(),
    vendor_id: Joi.string().required()
});

module.exports = billSchema;