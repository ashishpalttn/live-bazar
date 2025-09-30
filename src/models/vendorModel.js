const Joi = require('joi');

// Define the Vendor Model Schema
const vendorSchema = Joi.object({
    vendorId: Joi.string().optional().label('vendorId'),
    user_id: Joi.string().required().label('user_id'),
    storeName: Joi.string().required().label('storeName'),
    ownerName: Joi.string().required().label('ownerName'),
    mobileNumber: Joi.string().required().label('mobileNumber'),
    emailId: Joi.string().optional().allow('').label('emailId'),
    category: Joi.string().required().label('category'),
    subcategory: Joi.array().items(Joi.string()).min(1).required().label('subcategory'),
    fullAddress: Joi.object({
        address: Joi.string().required().label('address'),
        city: Joi.string().required().label('city'),
        state: Joi.string().required().label('state'),
        pincode: Joi.number().optional().label('pincode'),
    }).required().label('fullAddress'),
    gst: Joi.boolean().optional().label('gst'),
    shopPhotos: Joi.array().items(Joi.string()).min(1).required().label('shopPhotos'),
    storeAbout: Joi.string().optional().allow('').label('storeAbout'),
    websitelink: Joi.string().optional().allow('').label('websitelink'),
    socialmedia1link: Joi.string().optional().allow('').label('socialmedia1link'),
    socialmedia2link: Joi.string().optional().allow('').label('socialmedia2link'),
    ownerSelfie: Joi.string().required().label('ownerSelfie'),
    ownerIdentity: Joi.object({
        idNumber: Joi.string().optional().label('idNumber'),
        idType: Joi.string().optional().label('idType'),
    }).optional().label('ownerIdentity'),
    licenseCertificateNumber: Joi.string().optional().allow('').label('licenseCertificateNumber'),
    licenseCertificate: Joi.string().optional().allow('').label('licenseCertificate'),
    gstNumber: Joi.string().optional().allow('').label('gstNumber'),
    storeGeolocation: Joi.string().required().label('storeGeolocation'),
    
});

module.exports = vendorSchema;
