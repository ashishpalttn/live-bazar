const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');

const USER_TABLE = process.env.DYNAMODB_USER_TABLE;

const createUser = async (user) => {
  // Generate a unique userId
  const userId = uuidv4();
  const newUser = { userId, ...user };

  const params = {
    TableName: USER_TABLE,
    Item: newUser,
  };

  await dynamoClient.put(params).promise();
  return newUser;
};

const getUser = async (userId) => {
  const params = {
    TableName: USER_TABLE,
    Key: { userId },
  };

  const result = await dynamoClient.get(params).promise();
  return result.Item;
};

module.exports = { createUser, getUser };
