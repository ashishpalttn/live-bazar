const { imageUploadHandler } = require('../handlers/imageUpload');

module.exports.handler = async (event) => {
    return await imageUploadHandler(event);
};
