const AWS = require('aws-sdk');

// Debug log to verify the AWS object
console.log("AWS SDK Version:", AWS.VERSION || "Built-in AWS SDK not found");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDb;
