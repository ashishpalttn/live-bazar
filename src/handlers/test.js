const AWS = require('aws-sdk');

exports.handler = async () => {
    console.log("AWS SDK Version:", AWS.VERSION || "Built-in AWS SDK not found");
    return { statusCode: 200, body: JSON.stringify({ message: "Test function executed successfully" }) };
};
