const dynamoDb = require('../config/database'); // Use the database config

// Debug log to verify the DynamoDB client
console.log("DynamoDB Client Configured");

module.exports = dynamoDb;
