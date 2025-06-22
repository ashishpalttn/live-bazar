const productService = require('../services/productService');
const vendorProductService = require('../services/vendorProductService');
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

        // if (httpMethod === 'GET') {
        //     console.log('Fetching a product');
        //     const product_id = pathParameters.id;
        //     const product = await productService.getProduct(product_id);
        //     const responseObj = getSuccessResponseObject('Product fetched successfully', [{product}]);
        //     return { statusCode: 200, body: JSON.stringify(responseObj) };
        // }

        if (httpMethod === 'GET' && event.path==='/products-by-vendor') {
            console.log('Fetching products for vendor_id:');
            // New endpoint: fetch products by vendor_id
            const {vendor_id} = event.queryStringParameters || {};
            // Get all vendor-product mappings for this vendor
            const vendorProducts = await vendorProductService.getProductIdsByVendorId(vendor_id);
            const productIds = vendorProducts.map(vp => vp.product_id);
            // Fetch product details for each product_id
            const products = [];
            for (const product_id of productIds) {
                try {
                    const product = await productService.getProduct(product_id);
                    products.push(product);
                } catch (e) {
                    // skip missing products
                }
            }
            const responseObj = getSuccessResponseObject('Products for vendor fetched successfully', [{ products, count: products.length }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && !pathParameters) {
            console.log('Fetching all products');
            const products = await productService.getAllProducts();
            const responseObj = getSuccessResponseObject('All products fetched successfully', [{products}]);
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
