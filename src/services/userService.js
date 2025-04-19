const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const userModel = require('../models/userModel');

const USER_TABLE = process.env.DYNAMODB_USER_TABLE;

const createUser = async (userData) => {
  // Validate user data using the userModel schema
  const { error, value } = userModel.validate(userData, { abortEarly: false });
  if (error) {
    throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
  }

  // Transform validated data and add timestamps
  const user = {
    ...value,
    userId: value.userId || uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Save user to DynamoDB
  const params = {
    TableName: USER_TABLE,
    Item: user,
  };

  await dynamoClient.put(params).promise();
  return user;
};

const getUser = async (userId) => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId },
  };

  const result = await dynamoClient.get(params).promise();

  // Check if the user exists
  if (!result.Item) {
    throw new Error(`User with userId "${userId}" not found`);
  }

  return result.Item;
};

module.exports = { createUser, getUser };
