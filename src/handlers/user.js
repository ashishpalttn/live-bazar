const userService = require('../services/userService');

exports.handler = async (event) => {
    try {
        if (event.httpMethod === 'POST') {
            const userData = JSON.parse(event.body);
            const user = await userService.createUser(userData);

            return {
                statusCode: 201,
                body: JSON.stringify({ message: 'User created successfully', user }),
            };
        } else if (event.httpMethod === 'GET') {
            const userId = event.pathParameters.id;
            const user = await userService.getUser(userId);

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'User fetched successfully', user }),
            };
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Method not allowed' }),
            };
        }
    } catch (error) {
        console.error('Error in user handler:', error);
        return {
            statusCode: error.message.includes('not found') ? 404 : 500,
            body: JSON.stringify({ message: 'Error processing request', error: error.message }),
        };
    }
};
