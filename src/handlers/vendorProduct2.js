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

        // Toggle active status for vendor products
        if (httpMethod === 'PATCH' && pathParameters && pathParameters.vendorId && event.path.includes('toggle-active')) {
            const vendor_id = pathParameters.vendorId;
            const { is_active } = JSON.parse(body);

            if (typeof is_active !== 'boolean') {
                return {
                    statusCode: 400,
                    body: JSON.stringify(getFailureResponseObject('Invalid is_active value', 'ERR_INVALID_INPUT')),
                };
            }

            try {
                const result = await vendorProductService.toggleVendorProductsActive(vendor_id, is_active);
                const responseObj = getSuccessResponseObject('Vendor products updated successfully', [{ result }]);
                return { statusCode: 200, body: JSON.stringify(responseObj) };
            } catch (err) {
                return require('../utils/util').handleApiError(err);
            }
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
                return require('../utils/util').handleApiError(err);
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
                return require('../utils/util').handleApiError(err);
            }
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify(getFailureResponseObject('Invalid request method', 'ERR_INVALID_METHOD')) 
        };
    } catch (error) {
        console.error('Error:', error);
        return require('../utils/util').handleApiError(error);
    }
};