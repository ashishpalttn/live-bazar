const { error } = require("console");

const RESPONSE_OBJECT = {
    status:"",
    message:"",
    data:[],
    errorCode:""
}
const getSuccessResponseObject = ( message, data) => {
    RESPONSE_OBJECT.status = "success";
    RESPONSE_OBJECT.message = message;
    RESPONSE_OBJECT.data = data;
    RESPONSE_OBJECT.errorCode = null;
    return RESPONSE_OBJECT;
}
const getFailureResponseObject = ( message, errorCode) => {
    RESPONSE_OBJECT.status = "failure";
    RESPONSE_OBJECT.message = message;
    RESPONSE_OBJECT.data = [];
    RESPONSE_OBJECT.errorCode = errorCode;
    return RESPONSE_OBJECT;
}
const getErrorResponseObject = () => {
    RESPONSE_OBJECT.status = "error";
    RESPONSE_OBJECT.message = "Internal server error";
    RESPONSE_OBJECT.data = null;
    RESPONSE_OBJECT.errorCode = "ERR_INTERNAL_SERVER";
    return RESPONSE_OBJECT;
}

/**
 * Removes sensitive fields from vendor data for CLIENT appType
 * @param {Object|Array} data - vendor object or array of vendor objects
 * @param {Array} fieldsToRemove - array of field names to remove
 * @param {String} appType - value of appType query param
 * @returns {Object|Array}
 */
function filterFieldsByAppType(data, fieldsToRemove, appType) {
    if (appType !== 'CLIENT') return data;
    const filterObj = (obj) => {
        const newObj = { ...obj };
        fieldsToRemove.forEach((field) => {
            delete newObj[field];
        });
        return newObj;
    };
    if (Array.isArray(data)) {
        return data.map(filterObj);
    }
    return filterObj(data);
}

/**
 * Generic error handler for API responses
 * @param {Error|Object} error - The error object or message
 * @returns {Object} { statusCode, body }
 */
function handleApiError(error) {
    // Custom error code pattern
    if (error && error.code === 'NOT_FOUND') {
        const errorResponse = getFailureResponseObject(error.message || 'Resource not found', error.code);
        return {
            statusCode: 404,
            body: JSON.stringify(errorResponse)
        };
    }
    if (error && error.code === 'ALREADY_EXISTS') {
        const errorResponse = getFailureResponseObject(error.message || 'Resource already exists', error.code);
        return {
            statusCode: 409,
            body: JSON.stringify(errorResponse)
        };
    }
    // Fallback to message string matching for legacy errors
    if (error && error.message && error.message.includes('not found')) {
        const errorResponse = getFailureResponseObject(error.message, 'ERR_NOT_FOUND');
        return {
            statusCode: 404,
            body: JSON.stringify(errorResponse)
        };
    }
    if (error && error.message && error.message.includes('already exists')) {
        const errorResponse = getFailureResponseObject(error.message, 'ERR_ALREADY_EXISTS');
        return {
            statusCode: 409,
            body: JSON.stringify(errorResponse)
        };
    }
    // Default internal error
    const errorResponse = getErrorResponseObject(error && error.message);
    return {
        statusCode: error && error.statusCode ? error.statusCode : 500,
        body: JSON.stringify(errorResponse)
    };
}

module.exports = {
    RESPONSE_OBJECT,
    getSuccessResponseObject,
    getFailureResponseObject,
    getErrorResponseObject,
    filterFieldsByAppType,
    handleApiError
};