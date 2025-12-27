const vendorCustomerService = require('../services/vendorCustomerService');
const { getSuccessResponseObject, getFailureResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, queryStringParameters } = event;

        if (httpMethod === 'GET' && queryStringParameters && queryStringParameters.mobile_no) {
            const mobile_no = queryStringParameters.mobile_no;
            const customer = await vendorCustomerService.findCustomerByMobileNo(mobile_no);

            if (customer) {
                const responseObj = getSuccessResponseObject('Customer fetched successfully', [{ customer }]);
                return { statusCode: 200, body: JSON.stringify(responseObj) };
            } else {
                return { 
                    statusCode: 404, 
                    body: JSON.stringify(getFailureResponseObject('Customer not found', 'ERR_CUSTOMER_NOT_FOUND')) 
                };
            }
        }

        if (httpMethod === 'GET' && pathParameters && pathParameters.vendor_id) {
            const vendor_id = pathParameters.vendor_id;
            const customers = await vendorCustomerService.findCustomersByVendorId(vendor_id);
            const responseObj = getSuccessResponseObject('Customers fetched successfully', [{ customers }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && pathParameters && pathParameters.customer_id) {
            const customer_id = pathParameters.customer_id;
            const vendors = await vendorCustomerService.findVendorsByCustomerId(customer_id);
            const responseObj = getSuccessResponseObject('Vendors fetched successfully', [{ vendors }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'POST') {
            const data = JSON.parse(event.body);

            // Generate a new customer_id if not provided
            if (!data.customer_id) {
                const { v4: uuidv4 } = require('uuid');
                data.customer_id = uuidv4();
            }

            const newEntry = await vendorCustomerService.createVendorCustomer(data);
            const responseObj = getSuccessResponseObject('Vendor-Customer mapping created successfully', [{ newEntry }]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH' && pathParameters && pathParameters.vendor_id && pathParameters.customer_id) {
            const updates = JSON.parse(event.body);
            const updatedEntry = await vendorCustomerService.updateVendorCustomer(pathParameters.vendor_id, pathParameters.customer_id, updates);
            const responseObj = getSuccessResponseObject('Vendor-Customer mapping updated successfully', [{ updatedEntry }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE' && pathParameters && pathParameters.vendor_id && pathParameters.customer_id) {
            await vendorCustomerService.deleteVendorCustomer(pathParameters.vendor_id, pathParameters.customer_id);
            const responseObj = getSuccessResponseObject('Vendor-Customer mapping deleted successfully');
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify(getFailureResponseObject('Invalid request method', 'ERR_INVALID_METHOD')) 
        };
    } catch (error) {
        console.error('Error in vendor-customer handler:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify(getFailureResponseObject(error.message, 'ERR_INTERNAL_SERVER'))
        };
    }
};