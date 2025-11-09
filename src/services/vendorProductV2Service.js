const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const vendorProductSchema = require('../models/vendorProductModel2');

const VENDOR_PRODUCT_TABLE = process.env.DYNAMODB_VENDOR_PRODUCT_TABLE || 'vendor-products-v2';

const createVendorProduct = async (productData) => {
    // Generate a product_id if not provided
    if (!productData.product_id) {
        productData.product_id = uuidv4();
    }

    const { error, value } = vendorProductSchema.validate(productData, { abortEarly: false });
    if (error) {
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }

    // Ensure both vendor_id and product_id are provided as they form composite key
    if (!value.vendor_id || !value.product_id) {
        throw new Error('Both vendor_id and product_id are required');
    }

    const vendorProduct = { ...value };

    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        Item: vendorProduct,
        // Add condition to prevent overwriting existing item
        ConditionExpression: 'attribute_not_exists(vendor_id) AND attribute_not_exists(product_id)'
    };

    try {
        await dynamoClient.put(params).promise();
        return vendorProduct;
    } catch (error) {
        if (error.code === 'ConditionalCheckFailedException') {
            const duplicateKeyError = new Error('Duplicate composite key error');
            duplicateKeyError.name = 'DuplicateKeyError';
            throw duplicateKeyError;
        }
        throw error;
    }
};

const getVendorProduct = async (vendor_id, product_id) => {
    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        Key: { 
            vendor_id,
            product_id
        },
    };

    const result = await dynamoClient.get(params).promise();
    if (!result.Item) {
        throw new Error(`Vendor product with vendor_id "${vendor_id}" and product_id "${product_id}" not found`);
    }

    return result.Item;
};

const getAllVendorProducts = async (vendor_id) => {
    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        KeyConditionExpression: 'vendor_id = :vendor_id',
        ExpressionAttributeValues: {
            ':vendor_id': vendor_id
        }
    };

    const result = await dynamoClient.query(params).promise();
    return {
        products: result.Items,
        count: result.Count
    };
};

const updateVendorProduct = async (vendor_id, product_id, updates) => {
    // First check if the item exists
    await getVendorProduct(vendor_id, product_id);

    // Create update expression dynamically
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Filter out vendor_id and product_id as they can't be updated
    const allowedUpdates = Object.entries(updates).filter(
        ([key]) => !['vendor_id', 'product_id'].includes(key)
    );

    allowedUpdates.forEach(([key, value]) => {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
    });

    // Add updatedAt timestamp
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        Key: {
            vendor_id,
            product_id
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };

    try {
        const result = await dynamoClient.update(params).promise();
        return result.Attributes;
    } catch (error) {
        console.error('Error updating vendor product:', error);
        throw new Error(`Failed to update vendor product: ${error.message}`);
    }
};

const deleteVendorProduct = async (vendor_id, product_id) => {
    // First check if the item exists
    await getVendorProduct(vendor_id, product_id);

    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        Key: {
            vendor_id,
            product_id
        }
    };

    try {
        await dynamoClient.delete(params).promise();
        return { success: true, message: 'Vendor product deleted successfully' };
    } catch (error) {
        console.error('Error deleting vendor product:', error);
        throw new Error(`Failed to delete vendor product: ${error.message}`);
    }
};

const toggleVendorProductsActive = async (vendor_id, is_active) => {
    const params = {
        TableName: VENDOR_PRODUCT_TABLE,
        KeyConditionExpression: 'vendor_id = :vendor_id',
        ExpressionAttributeValues: {
            ':vendor_id': vendor_id
        }
    };

    const result = await dynamoClient.query(params).promise();
    const products = result.Items;

    if (!products || products.length === 0) {
        throw new Error(`No products found for vendor_id: ${vendor_id}`);
    }

    const updatePromises = products.map((product) => {
        const updateParams = {
            TableName: VENDOR_PRODUCT_TABLE,
            Key: {
                vendor_id: product.vendor_id,
                product_id: product.product_id
            },
            UpdateExpression: 'SET is_active = :is_active, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':is_active': is_active,
                ':updatedAt': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        };

        return dynamoClient.update(updateParams).promise();
    });

    const updatedProducts = await Promise.all(updatePromises);
    return updatedProducts.map((product) => product.Attributes);
};

module.exports = {
    createVendorProduct,
    getVendorProduct,
    getAllVendorProducts,
    updateVendorProduct,
    deleteVendorProduct,
    toggleVendorProductsActive
};