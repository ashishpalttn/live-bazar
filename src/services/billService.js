const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const billModel = require('../models/billModel');

const BILLS_TABLE = 'bills';

const createBill = async (billData) => {
    if (!billData.bill_id) {
        billData.bill_id = uuidv4();
    }
    const { error, value } = billModel.validate(billData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    const bill = {
        ...value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const params = {
        TableName: BILLS_TABLE,
        Item: bill,
    };

    await dynamoClient.put(params).promise();
    return bill;
};

const getBill = async (bill_id) => {
    const params = {
        TableName: BILLS_TABLE,
        Key: { bill_id },
    };

    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Bill with bill_id "${bill_id}" not found`);
    }

    return result.Item;
};

const getAllBills = async () => {
    const params = {
        TableName: BILLS_TABLE,
    };

    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

const updateBill = async (bill_id, updates) => {
    const { error } = billModel.validate(updates, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    const params = {
        TableName: BILLS_TABLE,
        Key: { bill_id },
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

const deleteBill = async (bill_id) => {
    const params = {
        TableName: BILLS_TABLE,
        Key: { bill_id },
    };

    await dynamoClient.delete(params).promise();
    return { bill_id };
};

module.exports = {
    createBill,
    getBill,
    getAllBills,
    updateBill,
    deleteBill
};