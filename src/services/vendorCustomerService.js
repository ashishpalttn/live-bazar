const dynamoClient = require('../utils/dynamoClient');
const vendorCustomerModel = require('../models/vendorCustomerModel');

const VENDOR_CUSTOMER_TABLE = 'vendor_customer_map';

const findCustomersByVendorId = async (vendor_id) => {
    const params = {
        TableName: VENDOR_CUSTOMER_TABLE,
        KeyConditionExpression: 'vendor_id = :vendor_id',
        ExpressionAttributeValues: {
            ':vendor_id': vendor_id
        }
    };

    const result = await dynamoClient.query(params).promise();
    return result.Items;
};

const findVendorsByCustomerId = async (customer_id) => {
    const params = {
        TableName: VENDOR_CUSTOMER_TABLE,
        IndexName: 'customer_id-index',
        KeyConditionExpression: 'customer_id = :customer_id',
        ExpressionAttributeValues: {
            ':customer_id': customer_id
        }
    };

    const result = await dynamoClient.query(params).promise();
    return result.Items;
};

const createVendorCustomer = async (data) => {
    const { error, value } = vendorCustomerModel.validate(data, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    // Check if mobile number already exists
    const params = {
        TableName: VENDOR_CUSTOMER_TABLE,
        IndexName: 'mobileNumber-index',
        KeyConditionExpression: 'mobileNumber = :mobileNumber',
        ExpressionAttributeValues: {
            ':mobileNumber': value.mobileNumber
        }
    };

    const result = await dynamoClient.query(params).promise();
    if (result.Items && result.Items.length > 0) {
        throw new Error('Mobile number already exists');
    }

    const putParams = {
        TableName: VENDOR_CUSTOMER_TABLE,
        Item: value
    };

    await dynamoClient.put(putParams).promise();
    return value;
};

const updateVendorCustomer = async (vendor_id, customer_id, updates) => {
    const params = {
        TableName: VENDOR_CUSTOMER_TABLE,
        Key: { vendor_id, customer_id },
        UpdateExpression: 'set ' + Object.keys(updates).map((key, i) => `#${key} = :value${i}`).join(', '),
        ExpressionAttributeNames: Object.keys(updates).reduce((acc, key) => ({ ...acc, [`#${key}`]: key }), {}),
        ExpressionAttributeValues: Object.values(updates).reduce((acc, value, i) => ({ ...acc, [`:value${i}`]: value }), {}),
        ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoClient.update(params).promise();
    return result.Attributes;
};

const deleteVendorCustomer = async (vendor_id, customer_id) => {
    const params = {
        TableName: VENDOR_CUSTOMER_TABLE,
        Key: { vendor_id, customer_id }
    };

    await dynamoClient.delete(params).promise();
};

const findCustomerByMobileNo = async (mobile_no) => {
    const params = {
        TableName: VENDOR_CUSTOMER_TABLE,
        IndexName: 'mobileNumber-index',
        KeyConditionExpression: 'mobileNumber = :mobile_no',
        ExpressionAttributeValues: {
            ':mobile_no': mobile_no
        }
    };

    const result = await dynamoClient.query(params).promise();
    return result.Items.length > 0 ? result.Items[0] : null;
};

module.exports = {
    findCustomersByVendorId,
    findVendorsByCustomerId,
    createVendorCustomer,
    updateVendorCustomer,
    deleteVendorCustomer,
    findCustomerByMobileNo
};