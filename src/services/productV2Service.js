const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const productV2Model = require('../models/productV2Model');

const PRODUCTS_V2_TABLE = 'products-II';

const createProductV2 = async (productData) => {
    const { error, value } = productV2Model.validate(productData, { abortEarly: false });
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
        TableName: PRODUCTS_V2_TABLE,
        Item: product,
    };

    await dynamoClient.put(params).promise();
    return product;
};

const getProductV2 = async (product_id) => {
    const params = {
        TableName: PRODUCTS_V2_TABLE,
        Key: { product_id },
    };

    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Product with product_id "${product_id}" not found`);
    }

    return result.Item;
};

const updateProductV2 = async (product_id, updates) => {
    // First validate the updates
    const { error } = productV2Model.validate(updates, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    const params = {
        TableName: PRODUCTS_V2_TABLE,
        Key: { product_id },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', ') + ', #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            ...Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
            '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
            ...Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
            ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoClient.update(params).promise();
    return result.Attributes;
};

const deleteProductV2 = async (product_id) => {
    const params = {
        TableName: PRODUCTS_V2_TABLE,
        Key: { product_id },
    };

    await dynamoClient.delete(params).promise();
    return { product_id };
};

const getAllProductsV2 = async () => {
    const params = {
        TableName: PRODUCTS_V2_TABLE,
    };

    const result = await dynamoClient.scan(params).promise();
    return {
        products: result.Items,
        count: result.Count
    };
};

module.exports = {
    createProductV2,
    getProductV2,
    updateProductV2,
    deleteProductV2,
    getAllProductsV2,
};