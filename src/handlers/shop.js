const shopService = require('../services/shopService');

exports.handler = async (event) => {
    try {
        debugger
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const shopData = JSON.parse(body);
            const shop = await shopService.createShop(shopData);
            return { statusCode: 201, body: JSON.stringify({ message: 'Shop created successfully', shop }) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const shops = await shopService.getAllShops();
            return { statusCode: 200, body: JSON.stringify({ message: 'All shops fetched successfully', shops }) };
        }

        if (httpMethod === 'GET') {
            const shopId = pathParameters.id;
            const shop = await shopService.getShop(shopId);
            return { statusCode: 200, body: JSON.stringify({ message: 'Shop fetched successfully', shop }) };
        }

        if (httpMethod === 'PATCH') {
            const shopId = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedShop = await shopService.updateShop(shopId, updates);
            return { statusCode: 200, body: JSON.stringify({ message: 'Shop updated successfully', updatedShop }) };
        }

        if (httpMethod === 'DELETE') {
            const shopId = pathParameters.id;
            const result = await shopService.deleteShop(shopId);
            return { statusCode: 200, body: JSON.stringify(result) };
        }

        return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
    } catch (error) {
        console.error('Error in shop handler:', error);
        return { statusCode: 500, body: JSON.stringify({ message: 'Internal server error', error: error.message }) };
    }
};
