const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const shopModel = require('../models/shopModel');

const SHOPS_TABLE = process.env.DYNAMODB_SHOPS_TABLE;

const createShop = async (shopData) => {
    const { error, value } = shopModel.validate(shopData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    const shop = {
        ...value,
        shopId: value.shopId || uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const params = {
        TableName: SHOPS_TABLE,
        Item: shop,
    };

    await dynamoClient.put(params).promise();
    return shop;
};

const getShop = async (shopId) => {
    const params = {
        TableName: SHOPS_TABLE,
        Key: { shopId },
    };

    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Shop with shopId "${shopId}" not found`);
    }

    return result.Item;
};

const updateShop = async (shopId, updates) => {
    const params = {
        TableName: SHOPS_TABLE,
        Key: { shopId },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', '),
        ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
        ExpressionAttributeValues: Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
        ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoClient.update(params).promise();
    return result.Attributes;
};

const deleteShop = async (shopId) => {
    const params = {
        TableName: SHOPS_TABLE,
        Key: { shopId },
    };

    await dynamoClient.delete(params).promise();
    return { message: `Shop with shopId "${shopId}" deleted successfully` };
};

const getAllShops = async () => {
    const params = {
        TableName: SHOPS_TABLE,
    };

    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

module.exports = { createShop, getShop, updateShop, deleteShop, getAllShops };
