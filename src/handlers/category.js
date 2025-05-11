const categoryService = require('../services/categoryService');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const categoryData = JSON.parse(body);
            const category = await categoryService.createCategory(categoryData);
            const responseObj = getSuccessResponseObject('Category created successfully', [{ category }]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const categories = await categoryService.getAllCategories();
            const responseObj = getSuccessResponseObject('All categories fetched successfully', [{ categories }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const categoryId = pathParameters.id;
            const category = await categoryService.getCategory(categoryId);
            const responseObj = getSuccessResponseObject('Category fetched successfully', [{ category }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH') {
            const categoryId = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedCategory = await categoryService.updateCategory(categoryId, updates);
            const responseObj = getSuccessResponseObject('Category updated successfully', [{ updatedCategory }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE') {
            const categoryId = pathParameters.id;
            const result = await categoryService.deleteCategory(categoryId);
            const responseObj = getSuccessResponseObject('Category deleted successfully', [{ result }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { statusCode: 405, body: JSON.stringify({ message: 'Method not allowed' }) };
    } catch (error) {
        console.error('Error in category handler:', error);
        return { statusCode: 500, body: JSON.stringify(getErrorResponseObject()) };
    }
};
