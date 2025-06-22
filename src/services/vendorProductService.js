const dynamoClient = require('../utils/dynamoClient');

const VENDOR_PRODUCT_TABLE = process.env.DYNAMODB_VENDOR_PRODUCT_TABLE || 'vendor-product';

// Fetch all product_ids for a given vendor_id from vendor-product table
const getProductIdsByVendorId = async (vendor_id) => {
    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        IndexName: 'vendor_id-index', // If you have a GSI on vendor_id, otherwise remove this line
        KeyConditionExpression: 'vendor_id = :vendor_id',
        ExpressionAttributeValues: {
            ':vendor_id': vendor_id
        }
    };
    try {
        const result = await dynamoClient.query(params).promise();
        return result.Items || [];
    } catch (err) {
        throw new Error('Error fetching vendor-product mapping: ' + err.message);
    }
};

module.exports = {
    getProductIdsByVendorId
};
