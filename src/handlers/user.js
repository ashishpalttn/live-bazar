const userService = require('../services/userService');

exports.handler = async (event) => {
  const { httpMethod, pathParameters, body } = event;

  try {
    if (httpMethod === 'POST') {
      const user = JSON.parse(body);
      await userService.createUser(user);
      return { statusCode: 201, body: JSON.stringify({ message: 'User created' }) };
    } else if (httpMethod === 'GET') {
      const userId = pathParameters.id;
      const user = await userService.getUser(userId);
      return { statusCode: 200, body: JSON.stringify(user) };
    }
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
