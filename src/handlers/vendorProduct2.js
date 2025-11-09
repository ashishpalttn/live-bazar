const vendorProductService = require('../services/vendorProductV2Service');
const {createProductV2} = require('../services/productV2Service')
const { getSuccessResponseObject, getFailureResponseObject, getErrorResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { queryStringParameters, httpMethod, pathParameters, body } = event;

        // Create vendor product
        if (httpMethod === 'POST') {

            try {
                const productData = JSON.parse(body);

                // Sanitize productData for createProductV2
                const { vendor_id, sell_price, quantity, discount_percentage, is_active, ...productDataForCreateProduct } = productData;

                // Check if a new product needs to be created
                if (queryStringParameters && queryStringParameters.isNewProduct) {
                    const product = await createProductV2(productDataForCreateProduct);
                    if (!productData.product_id) {
                        productData.product_id = product.product_id;
                    }
                }

                const product = await vendorProductService.createVendorProduct(productData);
                const responseObj = getSuccessResponseObject('Vendor product created successfully', [{ product }]);
                return { statusCode: 201, body: JSON.stringify(responseObj) };
            } catch (error) {
                console.error('Error creating vendor product:', error);

                // Handle duplicate composite key errors using standardized error name
                if (error.name === 'DuplicateKeyError') {
                    return {
                        statusCode: 400,
                        body: JSON.stringify(getFailureResponseObject('A vendor product with the same vendor_id and product_id already exists', 'ERR_DUPLICATE_KEY')),
                    };
                }

                // Handle JSON parsing errors
                if (error instanceof SyntaxError) {
                    return {
                        statusCode: 400,
                        body: JSON.stringify(getFailureResponseObject('Invalid JSON format', 'ERR_INVALID_JSON')),
                    };
                }

                // Handle validation errors explicitly
                if (error.name === 'Error') {
                    return {
                        statusCode: 400,
                        body: JSON.stringify(getFailureResponseObject(error.message, 'ERR_VALIDATION')),
                    };
                }

                return {
                    statusCode: 500,
                    body: JSON.stringify(getFailureResponseObject('Internal server error', 'ERR_INTERNAL_SERVER')),
                };
            }
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