const Joi = require('joi');

// Define the User Model Schema
const userSchema = Joi.object({
    userId: Joi.string().optional(),
    name: Joi.string().required(), // Ensure name is a string and required
    email: Joi.string().email().required(), // Ensure email is a valid email
    createdAt: Joi.date().optional(),
    updatedAt: Joi.date().optional(),
});

module.exports = userSchema;
