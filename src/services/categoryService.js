const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const categoryModel = require('../models/categoryModel');

const CATEGORIES_TABLE = process.env.DYNAMODB_CATEGORIES_TABLE;

const createCategory = async (categoryData) => {
    const { error, value } = categoryModel.validate(categoryData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    const category = {
        ...value,
        categoryId: value.categoryId || uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const params = {
        TableName: CATEGORIES_TABLE,
        Item: category,
    };

    await dynamoClient.put(params).promise();
    return category;
};

const getCategory = async (categoryId) => {
    const params = {
        TableName: CATEGORIES_TABLE,
        Key: { categoryId },
    };

    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Category with categoryId "${categoryId}" not found`);
    }

    return result.Item;
};

const updateCategory = async (categoryId, updates) => {
    const params = {
        TableName: CATEGORIES_TABLE,
        Key: { categoryId },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', '),
        ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
        ExpressionAttributeValues: Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
        ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoClient.update(params).promise();

    return result.Attributes.category;
};

const deleteCategory = async (categoryId) => {
    const params = {
        TableName: CATEGORIES_TABLE,
        Key: { categoryId },
    };

    await dynamoClient.delete(params).promise();
    return { message: `Category with categoryId "${categoryId}" deleted successfully` };
};

const getAllCategories = async () => {
    const params = {
        TableName: CATEGORIES_TABLE,
    };

    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

module.exports = { createCategory, getCategory, updateCategory, deleteCategory, getAllCategories };
