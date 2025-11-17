const billService = require('../services/billService');
const { getSuccessResponseObject, getFailureResponseObject } = require('../utils/util');

exports.handler = async (event) => {
    try {
        const { httpMethod, pathParameters, body } = event;

        if (httpMethod === 'POST') {
            const billData = JSON.parse(body);
            const bill = await billService.createBill(billData);
            const responseObj = getSuccessResponseObject('Bill created successfully', [{ bill }]);
            return { statusCode: 201, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && pathParameters && pathParameters.id) {
            const bill_id = pathParameters.id;
            const bill = await billService.getBill(bill_id);
            const responseObj = getSuccessResponseObject('Bill fetched successfully', [{ bill }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET' && pathParameters && pathParameters.vendor_id) {
            const vendor_id = pathParameters.vendor_id;
            const bills = await billService.findBillsByVendorId(vendor_id);
            const responseObj = getSuccessResponseObject('Bills fetched successfully by vendor_id', [{ bills }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'GET') {
            const bills = await billService.getAllBills();
            const responseObj = getSuccessResponseObject('Bills fetched successfully', [{ bills }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'PATCH') {
            const bill_id = pathParameters.id;
            const updates = JSON.parse(body);
            const updatedBill = await billService.updateBill(bill_id, updates);
            const responseObj = getSuccessResponseObject('Bill updated successfully', [{ bill: updatedBill }]);
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        if (httpMethod === 'DELETE') {
            const bill_id = pathParameters.id;
            await billService.deleteBill(bill_id);
            const responseObj = getSuccessResponseObject('Bill deleted successfully');
            return { statusCode: 200, body: JSON.stringify(responseObj) };
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify(getFailureResponseObject('Invalid request method', 'ERR_INVALID_METHOD')) 
        };
    } catch (error) {
        console.error('Error in bill handler:', error);
        return { 
            statusCode: 500, 
            body: JSON.stringify(getFailureResponseObject(error.message, 'ERR_INTERNAL_SERVER'))
        };
    }
};