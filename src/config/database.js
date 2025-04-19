const AWS = require('aws-sdk');

// DynamoDB Configuration
const dynamoDbConfig = {
    region: process.env.AWS_REGION || 'ap-south-1',
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined // Optional for local testing
};

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDbConfig);

module.exports = dynamoDb;
