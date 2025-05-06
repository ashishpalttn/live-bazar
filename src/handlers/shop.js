const shopService = require('../services/shopService');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        debugger
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const shopData = JSON.parse(body);
            const shop = await shopService.createShop(shopData);
            const responseObj = getSuccessResponseObject('Shop created successfully', [{shop}]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const shops = await shopService.getAllShops();
            const responseObj = getSuccessResponseObject('All shops fetched successfully', [{shops}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const shopId = pathParameters.id;
            const shop = await shopService.getShop(shopId);
            const responseObj = getSuccessResponseObject('Shop fetched successfully', [{shop}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH') {
            const shopId = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedShop = await shopService.updateShop(shopId, updates);
            const responseObj = getSuccessResponseObject('Shop updated successfully', [{updatedShop}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE') {
            const shopId = pathParameters.id;
            const result = await shopService.deleteShop(shopId);
            const responseObj = getSuccessResponseObject('Shop deleted successfully', [{result}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
    } catch (error) {
        console.error('Error in shop handler:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error', error: error.message }) };
    }
};
