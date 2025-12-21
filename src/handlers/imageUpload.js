const AWS = require('aws-sdk');
const Busboy = require('busboy');
const mime = require('mime-types'); // Add this at the top of the file
const { getSuccessResponseObject, getFailureResponseObject } = require('../utils/util');

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.IMAGE_BUCKET || 'areafi-image-bucket';

async function imageUploadHandler(event) {
    try {
        const contentType = event.headers['content-type'] || event.headers['Content-Type'];
        const busboy = Busboy({ headers: { 'content-type': contentType } });
        const results = [];
        const uploads = [];

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            let actualFilename = filename;
            if (filename && typeof filename === 'object' && filename.filename) {
                actualFilename = filename.filename;
            }
            const buffers = [];
            file.on('data', (data) => buffers.push(data));
            file.on('end', () => {
                const buffer = Buffer.concat(buffers);
                let contentType = mimetype || mime.lookup(actualFilename); // Dynamically determine MIME type
                if (!contentType || !/^image\//.test(contentType)) {
                    contentType = 'image/jpeg'; // Default to image/jpeg if MIME type is invalid
                }

                const params = {
                    Bucket: BUCKET_NAME,
                    Key: actualFilename,
                    Body: buffer,
                    ContentType: contentType,
                    ContentDisposition: 'inline',
                    MetadataDirective: 'REPLACE',
                    ACL: 'public-read' // Ensure the object is publicly accessible
                };
                uploads.push(
                    s3.upload(params).promise()
                        .then(() => {
                            results.push({ fileName: actualFilename, status: 'success', url: `https://${BUCKET_NAME}.s3.amazonaws.com/${actualFilename}` });
                        })
                        .catch((err) => {
                            results.push({ fileName: actualFilename, status: 'failure', error: err.message });
                        })
                );
            });
        });

        await new Promise((resolve, reject) => {
            busboy.on('finish', async () => {
                await Promise.all(uploads);
                resolve();
            });
            busboy.on('error', reject);
            busboy.end(Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8'));
        });

        return {
            statusCode: 200,
            body: JSON.stringify(getSuccessResponseObject('Files processed', results))
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(getFailureResponseObject(error.message, 'ERR_IMAGE_UPLOAD_FAILED'))
        };
    }
}

module.exports = { imageUploadHandler };
