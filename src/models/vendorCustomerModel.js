const Joi = require('joi');

// Define the Vendor-Customer Mapping Model Schema
const vendorCustomerSchema = Joi.object({
    vendor_id: Joi.string().required(),
    customer_id: Joi.string().required(),
    name: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    fullAddress: Joi.string().optional().allow('')
});

module.exports = vendorCustomerSchema;