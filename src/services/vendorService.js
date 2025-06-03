const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const vendorModel = require('../models/vendorModel');

const VENDORS_TABLE = process.env.DYNAMODB_VENDORS_TABLE || 'vendors';

const createVendor = async (vendorData) => {
    const { error, value } = vendorModel.validate(vendorData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }
    const vendor = {
        ...value,
        vendor_id: value.vendor_id || uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const params = {
        TableName: VENDORS_TABLE,
        Item: vendor,
    };
    await dynamoClient.put(params).promise();
    return vendor;
};

const getVendor = async (vendor_id) => {
    const params = {
        TableName: VENDORS_TABLE,
        Key: { vendor_id },
    };
    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Vendor with vendor_id "${vendor_id}" not found`);
    }
    return result.Item;
};

const getAllVendors = async () => {
    const params = {
        TableName: VENDORS_TABLE,
    };
    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

const updateVendor = async (vendor_id, updates) => {
    const params = {
        TableName: VENDORS_TABLE,
        Key: { vendor_id },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', '),
        ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
        ExpressionAttributeValues: Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
        ReturnValues: 'ALL_NEW',
    };
    const result = await dynamoClient.update(params).promise();
    return result.Attributes;
};

const deleteVendor = async (vendor_id) => {
    const params = {
        TableName: VENDORS_TABLE,
        Key: { vendor_id },
    };
    await dynamoClient.delete(params).promise();
    return { vendor_id };
};

module.exports = {
    createVendor,
    getVendor,
    getAllVendors,
    updateVendor,
    deleteVendor,
};
