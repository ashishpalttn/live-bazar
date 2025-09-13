const vendorService = require('../services/vendorService');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');
const { filterFieldsByAppType } = require('../utils/util');
const { vendorSensitiveFieldsForClient } = require('../sensitiveData/vendorSensitiveFields');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;
        const appType = (event.queryStringParameters && event.queryStringParameters.appType) || null;

        if (httpMethod === 'POST') {
            const vendorData = JSON.parse(body);
            try {
                const vendor = await vendorService.createVendor(vendorData);
                const responseObj = getSuccessResponseObject('Vendor created successfully', [vendor]);
                return { statusCode: 201, body: JSON.stringify(responseObj) };
            } catch (err) {
                if (err.emptyFields) {
                    const responseObj = getFailureResponseObject(
                        `Mandatory fields empty: ${err.emptyFields.join(', ')}`,
                        'ERR_MANDATORY_FIELDS_EMPTY'
                    );
                    return { statusCode: 400, body: JSON.stringify(responseObj) };
                }
                const responseObj = getFailureResponseObject(err.message, 'ERR_VALIDATION');
                return { statusCode: 400, body: JSON.stringify(responseObj) };
            }
        }

        if (httpMethod === 'GET' && event.path === '/vendors-by-city-category') {
            const { latitude, longitude, range, category_code, subcategory_code, city } = event.queryStringParameters || {};
            let vendors;
            const radiusKm = range ? parseFloat(range) / 1000 : 5;
            if (latitude && longitude) {
                if (category_code || subcategory_code) {
                    // Find vendors under range for city, category, and subcategory
                    vendors = await vendorService.getVendorsByCityCategorySubcategoryAndLocation(city, category_code, subcategory_code, parseFloat(latitude), parseFloat(longitude), radiusKm);
                } else {
                    // Find vendors under range for city, all categories/subcategories
                    vendors = await vendorService.getVendorsByCityCategorySubcategoryAndLocation(city, null, null, parseFloat(latitude), parseFloat(longitude), radiusKm);
                }
            } else {
                // No lat/lng: filter by city, category, and subcategory
                vendors = await vendorService.getVendorsByCityCategoryAndSubcategory(city, category_code, subcategory_code);
            }
            vendors = getSuccessResponseObject('Vendors fetched successfully', 
                filterFieldsByAppType(vendors, vendorSensitiveFieldsForClient, appType)
            );
            return { statusCode: 200, body: JSON.stringify(vendors) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const vendors = await vendorService.getAllVendors();
            const responseObj = getSuccessResponseObject('All vendors fetched successfully',
                filterFieldsByAppType(vendors, vendorSensitiveFieldsForClient, appType)
            );
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const vendor_id = pathParameters.id;
            const vendor = await vendorService.getVendor(vendor_id);
            const responseObj = getSuccessResponseObject('Vendor fetched successfully', 
                filterFieldsByAppType(vendor, vendorSensitiveFieldsForClient, appType)
            );
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
