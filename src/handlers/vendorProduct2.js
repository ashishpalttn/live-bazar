const vendorProductService = require('../services/vendorProductV2Service');
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        // Create vendor product
        if (httpMethod === 'POST') {
            const productData = JSON.parse(body);
            const product = await vendorProductService.createVendorProduct(productData);
            const responseObj = getSuccessResponseObject('Vendor product created successfully', [{ product }]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }
        // Get specific vendor product
        // if (httpMethod === 'GET' && pathParameters && pathParameters.productId) {
        //     const vendor_id = pathParameters.vendorId;
        //     const product_id = pathParameters.productId;
        //     const product = await vendorProductService.getVendorProduct(vendor_id, product_id);
        //     const responseObj = getSuccessResponseObject('Vendor product fetched successfully', [{ product }]);
        //     return { statusCode: 200, body: JSON.stringify(responseObj) };
        // }

        // Get all products for a vendor
        if (httpMethod === 'GET' && pathParameters && !pathParameters.productId) {
            const vendor_id = pathParameters.vendorId;
            const { products, count } = await vendorProductService.getAllVendorProducts(vendor_id);
            const responseObj = getSuccessResponseObject('Vendor products fetched successfully', [{
                products,
                count
            }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        // Update vendor product
        if (httpMethod === 'PATCH') {
            const vendor_id = pathParameters.vendorId;
            const product_id = pathParameters.productId;
            const updates = JSON.parse(body);
            try {
                const updatedProduct = await vendorProductService.updateVendorProduct(vendor_id, product_id, updates);
                const responseObj = getSuccessResponseObject('Vendor product updated successfully', [{ product: updatedProduct }]);
                return { statusCode: 200, body: JSON.stringify(responseObj) };
            } catch (err) {
                if (err.message && err.message.includes('not found')) {
                    const errorResponse = getFailureResponseObject(err.message, 'ERR_VENDOR_PRODUCT_NOT_FOUND');
                    return {
                        statusCode: 404,
                        body: JSON.stringify(errorResponse)
                    };
                }
                throw err;
            }
        }

        // Delete vendor product
        if (httpMethod === 'DELETE') {
            const vendor_id = pathParameters.vendorId;
            const product_id = pathParameters.productId;
            try {
                const result = await vendorProductService.deleteVendorProduct(vendor_id, product_id);
                const responseObj = getSuccessResponseObject('Vendor product deleted successfully', [{ result }]);
                return { statusCode: 200, body: JSON.stringify(responseObj) };
            } catch (err) {
                if (err.message && err.message.includes('not found')) {
                    const errorResponse = getFailureResponseObject(err.message, 'ERR_VENDOR_PRODUCT_NOT_FOUND');
                    return {
                        statusCode: 404,
                        body: JSON.stringify(errorResponse)
                    };
                }
                throw err;
            }
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify(getFailureResponseObject('Invalid request method', 'ERR_INVALID_METHOD')) 
        };
    } catch (error) {
        console.error('Error:', error);
        // Custom error for duplicate vendor product
        if (error.message && error.message.includes('already exists')) {
            const errorResponse = getFailureResponseObject(error.message, 'ERR_VENDOR_PRODUCT_EXISTS');
            return {
                statusCode: 409,
                body: JSON.stringify(errorResponse)
            };
        }
        const errorResponse = getErrorResponseObject(error.message);
        return {
            statusCode: error.statusCode || 500,
            body: JSON.stringify(errorResponse)
        };
    }
};