const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const productModel = require('../models/productModel');

const PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE || 'products';

const createProduct = async (productData) => {
    const { error, value } = productModel.validate(productData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }
    const product = {
        ...value,
        product_id: value.product_id || uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const params = {
        TableName: PRODUCTS_TABLE,
        Item: product,
    };
    await dynamoClient.put(params).promise();
    return product;
};

const getProduct = async (product_id) => {
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: { product_id },
    };
    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Product with product_id "${product_id}" not found`);
    }
    return result.Item;
};

const updateProduct = async (product_id, updates) => {
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: { product_id },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', '),
        ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
        ExpressionAttributeValues: Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
        ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoClient.update(params).promise();
    return result.Attributes;
};

const deleteProduct = async (product_id) => {
    const params = {
        TableName: PRODUCTS_TABLE,
        Key: { product_id },
    };
    await dynamoClient.delete(params).promise();
    return { product_id };
};

const getAllProducts = async () => {
    const params = {
        TableName: PRODUCTS_TABLE,
    };
    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

module.exports = {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
};
