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

        console.log('Event body encoding:', event.isBase64Encoded ? 'base64' : 'utf8');
        console.log('Event body size:', event.body.length);

        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            console.log('Processing file:', filename);
            console.log('File encoding:', encoding);
            console.log('File mimetype:', mimetype);

            let actualFilename = filename;
            if (filename && typeof filename === 'object' && filename.filename) {
                actualFilename = filename.filename;
            }
            const buffers = [];
            file.on('data', (data) => {
                console.log('Received data chunk of size:', data.length);
                buffers.push(data);
            });
            file.on('end', () => {
                const buffer = Buffer.concat(buffers);
                console.log('Final buffer size:', buffer.length);

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

            const bodyBuffer = event.isBase64Encoded
                ? Buffer.from(event.body, 'base64') // Decode base64 body
                : Buffer.from(event.body, 'utf8'); // Handle utf8 body

            busboy.end(bodyBuffer); // Pass the decoded buffer to Busboy
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
