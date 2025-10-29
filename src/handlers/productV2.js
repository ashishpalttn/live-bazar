const productV2Service = require('../services/productV2Service');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const productData = JSON.parse(body);
            const product = await productV2Service.createProductV2(productData);
            const responseObj = getSuccessResponseObject('Product created successfully', [{ product }]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }


        if (httpMethod === 'GET' && event.queryStringParameters && event.queryStringParameters.product_Name) {
            const { product_Name } = event.queryStringParameters;
            const { products, count } = await productV2Service.searchProductsByName(product_Name);
            const responseObj = getSuccessResponseObject('Products searched successfully', [{ 
                products,
                count,
                searchTerm: product_Name
            }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const product_id = pathParameters.id;
            const product = await productV2Service.getProductV2(product_id);
            const responseObj = getSuccessResponseObject('Product fetched successfully', [{ product }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH') {
            const product_id = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedProduct = await productV2Service.updateProductV2(product_id, updates);
            const responseObj = getSuccessResponseObject('Product updated successfully', [{ product: updatedProduct }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            const { products, count } = await productV2Service.getAllProductsV2();
            const responseObj = getSuccessResponseObject('Products fetched successfully', [{
                products,
                count
            }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE') {
            const product_id = pathParameters.id;
            const result = await productV2Service.deleteProductV2(product_id);
            const responseObj = getSuccessResponseObject('Product deleted successfully', [{ result }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify(getFailureResponseObject('Invalid request method', 'ERR_INVALID_METHOD')) 
        };
    } catch (error) {
        console.error('Error in product handler:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify(getFailureResponseObject(error.message, 'ERR_INTERNAL_SERVER'))
        };
    }
};