const productService = require('../services/productService');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const productData = JSON.parse(body);
            const product = await productService.createProduct(productData);
            const responseObj = getSuccessResponseObject('Product created successfully', [{product}]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const products = await productService.getAllProducts();
            const responseObj = getSuccessResponseObject('All products fetched successfully', [{products}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const product_id = pathParameters.id;
            const product = await productService.getProduct(product_id);
            const responseObj = getSuccessResponseObject('Product fetched successfully', [{product}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH') {
            const product_id = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedProduct = await productService.updateProduct(product_id, updates);
            const responseObj = getSuccessResponseObject('Product updated successfully', [{updatedProduct}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE') {
            const product_id = pathParameters.id;
            const result = await productService.deleteProduct(product_id);
            const responseObj = getSuccessResponseObject('Product deleted successfully', [{result}]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }
    } catch (error) {
        const responseObj = getErrorResponseObject(error.message);
        return { statusCode: 500, body: JSON.stringify(responseObj) };
    }
};
