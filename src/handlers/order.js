const orderService = require('../services/orderService');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const orderData = JSON.parse(body);
            const order = await orderService.createOrder(orderData);
            const responseObj = getSuccessResponseObject('Order created successfully', [{ order }]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && pathParameters && pathParameters.id) {
            const order_id = pathParameters.id;
            const order = await orderService.getOrder(order_id);
            const responseObj = getSuccessResponseObject('Order fetched successfully', [{ order }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const orders = await orderService.getAllOrders();
            const responseObj = getSuccessResponseObject('All orders fetched successfully', [{ orders }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH' && pathParameters && pathParameters.id) {
            const order_id = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedOrder = await orderService.updateOrder(order_id, updates);
            const responseObj = getSuccessResponseObject('Order updated successfully', [{ updatedOrder }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE' && pathParameters && pathParameters.id) {
            const order_id = pathParameters.id;
            await orderService.deleteOrder(order_id);
            const responseObj = getSuccessResponseObject('Order deleted successfully');
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify(getFailureResponseObject('Invalid request method', 'ERR_INVALID_METHOD')) 
        };
    } catch (error) {
        console.error('Error in order handler:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify(getFailureResponseObject(error.message, 'ERR_INTERNAL_SERVER'))
        };
    }
};