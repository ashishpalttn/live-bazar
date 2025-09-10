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

module.exports = {
    RESPONSE_OBJECT,
    getSuccessResponseObject,
    getFailureResponseObject,
    getErrorResponseObject,
    filterFieldsByAppType
};