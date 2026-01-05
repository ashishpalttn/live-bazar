const Joi = require('joi');

// Define the Order Model Schema
const orderSchema = Joi.object({
    order_id: Joi.string().required(),
    created_on: Joi.string().required(),
    customerDetails: Joi.object({
        customerId: Joi.string().optional(),
        customerName: Joi.string().optional(),
        MobileNumber: Joi.string().optional()
    }).required(),
    deliverAddress: Joi.object().optional(),
    vendorDetails: Joi.object({
        vendorId: Joi.string().optional(),
        vendorName: Joi.string().optional(),
        mobileNumber: Joi.string().optional(),
        address: Joi.string().optional()
    }).required(),
    items: Joi.array().items(Joi.object({
        itemId: Joi.string().required(),
        itemName: Joi.string().optional(),
        price: Joi.number().optional()
    })).required(),
    payment: Joi.object({
        bill_id: Joi.string().optional(),
        paymentMode: Joi.string().optional(),
        paymentStatus: Joi.string().optional(),
        discount: Joi.number().optional(),
        tax: Joi.number().optional(),
        subTotal: Joi.number().optional(),
        total: Joi.number().optional()
    }).required(),
    deliverPartnerDetail: Joi.object({
        deliveryPartnerId: Joi.string().optional(),
        name: Joi.string().optional(),
        MobileNumber: Joi.string().optional()
    }).optional(),
    customerNote: Joi.string().optional(),
    rating: Joi.number().optional(),
    feedback: Joi.string().optional(),
    orderStatus: Joi.string().valid('created', 'pickedUp', 'delivered').required(),
    isDeleted: Joi.boolean().default(false)
});

module.exports = orderSchema;