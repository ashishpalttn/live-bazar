const { v4: uuidv4 } = require('uuid');
const dynamoClient = require('../utils/dynamoClient');
const vendorModel = require('../models/vendorModel');

const VENDORS_TABLE = process.env.DYNAMODB_VENDORS_TABLE || 'vendors';

const createVendor = async (vendorData) => {
    console.log('Creating vendor with data:', vendorData);
    // Validate using Joi schema
    const { error, value } = vendorModel.validate(vendorData, { abortEarly: false });
    if (error) {
        // Find all empty mandatory fields
        const emptyFields = [];
        vendorModel._ids._byKey.forEach((schema, key) => {
            if (schema.flags && schema.flags.presence === 'required') {
                if (
                    vendorData[key] === undefined ||
                    vendorData[key] === null ||
                    (Array.isArray(vendorData[key]) && vendorData[key].length === 0) ||
                    (typeof vendorData[key] === 'string' && vendorData[key].trim() === '')
                ) {
                    emptyFields.push(key);
                }
            }
        });
        if (emptyFields.length > 0) {
            const errorMsg = `Mandatory fields empty: ${emptyFields.join(', ')}`;
            const err = new Error(errorMsg);
            err.emptyFields = emptyFields;
            throw err;
        }
        throw new Error(`Validation error: ${error.details.map((err) => err.message).join(', ')}`);
    }
    const vendor = {
        ...value,
        vendorId: value.vendorId || uuidv4(),
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
    console.log(`Fetching vendor with vendor_id: ${vendor_id}`);
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


const updateVendor = async (vendor_id, updates) => {
    console.log(`Updating vendor with vendor_id: ${vendor_id}`);
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
    console.log(`Deleting vendor with vendor_id: ${vendor_id}`);
    const params = {
        TableName: VENDORS_TABLE,
        Key: { vendor_id },
    };
    await dynamoClient.delete(params).promise();
    return { vendor_id };
};

const getVendorsByCityAndCategory = async (city, category_code) => {
    console.log(`Fetching vendors for city: ${city}, category_code: ${category_code}`);
    let filterExp = '#city = :city';
    let attrNames = { '#city': 'city' };
    let attrValues = { ':city': city };
    if (category_code) {
        filterExp += ' and #category_code = :category_code';
        attrNames['#category_code'] = 'category_code';
        attrValues[':category_code'] = category_code;
    }
    const params = {
        TableName: VENDORS_TABLE,
        FilterExpression: filterExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
    };
    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

const getVendorsByCityCategoryAndLocation = async (city, category_code, latitude, longitude, radiusKm = 5) => {
    console.log(`Fetching vendors for city: ${city}, category_code: ${category_code}, within ${radiusKm} km`);
    // Haversine formula to calculate distance between two lat/lng points

    // Build scan filter
    let filterExp = '#city = :city';
    let attrNames = { '#city': 'city' };
    let attrValues = { ':city': city };
    if (category_code) {
        filterExp += ' and #category_code = :category_code';
        attrNames['#category_code'] = 'category_code';
        attrValues[':category_code'] = category_code;
    }
    const params = {
        TableName: VENDORS_TABLE,
        FilterExpression: filterExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
    };
    const result = await dynamoClient.scan(params).promise();
    const vendors = (result.Items || []).filter(vendor => {
        if (!vendor.latitude || !vendor.longitude) return false;
        const dist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            parseFloat(vendor.latitude),
            parseFloat(vendor.longitude)
        );
        return dist <= radiusKm;
    });
    return vendors;
};

const getVendorsByCityCategorySubcategoryAndLocation = async (city, category_code, subcategory_code, latitude, longitude, radiusKm = 5) => {
    // Build scan filter
    let filterExp = '#city = :city';
    let attrNames = { '#city': 'city' };
    let attrValues = { ':city': city };
    if (category_code) {
        filterExp += ' and #category_code = :category_code';
        attrNames['#category_code'] = 'category_code';
        attrValues[':category_code'] = category_code;
    }
    if (subcategory_code) {
        filterExp += ' and #subcategory_code = :subcategory_code';
        attrNames['#subcategory_code'] = 'subcategory_code';
        attrValues[':subcategory_code'] = subcategory_code;
    }
    const params = {
        TableName: VENDORS_TABLE,
        FilterExpression: filterExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
    };
    const result = await dynamoClient.scan(params).promise();
    const vendors = (result.Items || []).filter(vendor => {
        if (!vendor.latitude || !vendor.longitude) return false;
        const dist = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            parseFloat(vendor.latitude),
            parseFloat(vendor.longitude)
        );
        return dist <= radiusKm;
    });
    return vendors;
};

const getVendorsByCityCategoryAndSubcategory = async (city, category_code, subcategory_code) => {
    let filterExp = '#city = :city';
    let attrNames = { '#city': 'city' };
    let attrValues = { ':city': city };
    if (category_code) {
        filterExp += ' and #category_code = :category_code';
        attrNames['#category_code'] = 'category_code';
        attrValues[':category_code'] = category_code;
    }
    if (subcategory_code) {
        filterExp += ' and #subcategory_code = :subcategory_code';
        attrNames['#subcategory_code'] = 'subcategory_code';
        attrValues[':subcategory_code'] = subcategory_code;
    }
    const params = {
        TableName: VENDORS_TABLE,
        FilterExpression: filterExp,
        ExpressionAttributeNames: attrNames,
        ExpressionAttributeValues: attrValues,
    };
    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

const getAllVendors = async () => {
    console.log('Fetching all vendors');
    const params = {
        TableName: VENDORS_TABLE,
    };
    const result = await dynamoClient.scan(params).promise();
    return result.Items;
};

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        // console.log(`Calculated distance: ${R * c} km`);
        return R * c; // Distance in km
    }

module.exports = {
    createVendor,
    getVendor,
    getAllVendors,
    updateVendor,
    deleteVendor,
    getVendorsByCityAndCategory,
    getVendorsByCityCategoryAndLocation,
    getVendorsByCityCategorySubcategoryAndLocation,
    getVendorsByCityCategoryAndSubcategory,
};
