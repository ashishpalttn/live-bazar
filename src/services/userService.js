const dynamoDb = require('../utils/dynamoClient');

const TABLE_NAME = process.env.DYNAMODB_USER_TABLE;

const createUser = async (user) => {
  const params = {
    TableName: TABLE_NAME,
    Item: user,
  };
  await dynamoDb.put(params).promise();
};

const getUser = async (userId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { userId },
  };
  const result = await dynamoDb.get(params).promise();
  return result.Item;
};

module.exports = { createUser, getUser };
