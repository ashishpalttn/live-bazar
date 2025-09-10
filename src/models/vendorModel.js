const Joi = require('joi');

// Define the Vendor Model Schema
const vendorSchema = Joi.object({
    vendorId: Joi.string().required().label('vendorId'),
    storeName: Joi.string().required().label('storeName'),
    ownerName: Joi.string().required().label('ownerName'),
    mobileNumber: Joi.string().required().label('mobileNumber'),
    emailId: Joi.string().optional().allow('').label('emailId'),
    category: Joi.string().required().label('category'),
    subcategory: Joi.array().items(Joi.string()).min(1).required().label('subcategory'),
    address: Joi.string().required().label('address'),
    gst: Joi.string().optional().allow('').label('gst'),
    shopPhotos: Joi.array().items(Joi.string()).min(1).required().label('shopPhotos'),
    storeAbout: Joi.string().optional().allow('').label('storeAbout'),
    websitelink: Joi.string().optional().allow('').label('websitelink'),
    socialmedia1link: Joi.string().optional().allow('').label('socialmedia1link'),
    socialmedia2link: Joi.string().optional().allow('').label('socialmedia2link'),
    ownerSelfie: Joi.string().required().label('ownerSelfie'),
    aadharPanNumber: Joi.string().optional().allow('').label('aadharPanNumber'),
    licenseCertificateNumber: Joi.string().optional().allow('').label('licenseCertificateNumber'),
    licenseCertificate: Joi.string().optional().allow('').label('licenseCertificate'),
    gstNumber: Joi.string().optional().allow('').label('gstNumber'),
    storeGeolocation: Joi.string().required().label('storeGeolocation'),
});

module.exports = vendorSchema;
