const dynamoClient = require('../utils/dynamoClient');
const orderModel = require('../models/orderModel');
const { v4: uuidv4 } = require('uuid');

const ORDERS_TABLE = 'orders';

const createOrder = async (orderData) => {
    const { error, value } = orderModel.validate(orderData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    const order = {
        ...value,
        order_id: value.order_id || uuidv4(),
        created_on: new Date().toISOString(),
        vendorId: value.vendorDetails.vendorId, // Flatten vendorId for easier querying
        customerId: value.customerDetails.customerId // Flatten customerId for easier querying
    };

    const params = {
        TableName: ORDERS_TABLE,
        Item: order
    };

    await dynamoClient.put(params).promise();
    return order;
};

const getOrder = async (order_id) => {
    const params = {
        TableName: ORDERS_TABLE,
        Key: { order_id }
    };

    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Order with order_id "${order_id}" not found`);
    }

    return result.Item;
};

const updateOrder = async (order_id, updates) => {
    const params = {
        TableName: ORDERS_TABLE,
        Key: { order_id },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', '),
        ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
        ExpressionAttributeValues: Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
        ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoClient.update(params).promise();
    return result.Attributes;
};

const deleteOrder = async (order_id) => {
    const params = {
        TableName: ORDERS_TABLE,
        Key: { order_id }
    };

    await dynamoClient.delete(params).promise();
    return { order_id };
};

const getAllOrders = async () => {
    const params = {
        TableName: ORDERS_TABLE
    };

    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

const getOrdersByVendorId = async (vendor_id) => {
    const params = {
        TableName: ORDERS_TABLE,
        FilterExpression: '#vendorId = :vendor_id',
        ExpressionAttributeNames: {
            '#vendorId': 'vendorId' // Updated to use the flattened vendorId field
        },
        ExpressionAttributeValues: {
            ':vendor_id': vendor_id
        }
    };

    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

module.exports = {
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
    getOrdersByVendorId
};