const vendorService = require('../services/vendorService');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const vendorData = JSON.parse(body);
            const vendor = await vendorService.createVendor(vendorData);
            const responseObj = getSuccessResponseObject('Vendor created successfully', [{vendor}]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && event.path === '/vendors-by-city-category') {
            const { city, category_code } = event.queryStringParameters || {};
            if (!city || !category_code) {
                return { statusCode: 400, body: JSON.stringify({ message: 'city and category_code query parameters are required' }) };
            }
            const vendors = await vendorService.getVendorsByCityAndCategory(city, category_code);
            const responseObj = getSuccessResponseObject('Vendors fetched successfully by city and category_code', [{vendors}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const vendors = await vendorService.getAllVendors();
            const responseObj = getSuccessResponseObject('All vendors fetched successfully', [{vendors}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const vendor_id = pathParameters.id;
            const vendor = await vendorService.getVendor(vendor_id);
            const responseObj = getSuccessResponseObject('Vendor fetched successfully', [{vendor}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH') {
            const vendor_id = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedVendor = await vendorService.updateVendor(vendor_id, updates);
            const responseObj = getSuccessResponseObject('Vendor updated successfully', [{updatedVendor}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE') {
            const vendor_id = pathParameters.id;
            const result = await vendorService.deleteVendor(vendor_id);
            const responseObj = getSuccessResponseObject('Vendor deleted successfully', [{result}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { statusCode: 400, body: JSON.stringify(getFailureResponseObject('Invalid request')) };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify(getErrorResponseObject(error.message)) };
    }
};
