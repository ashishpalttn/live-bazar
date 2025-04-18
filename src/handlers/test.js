const AWS = require('aws-sdk');

exports.handler = async () => {
    try {
        console.log("AWS SDK Version:", AWS.VERSION || "Built-in AWS SDK not found");
        return { statusCode: 200, body: JSON.stringify({ message: "Test function executed successfully" }) };
    } catch (error) {
        console.error("Error in testFunction:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal server error", error: error.message }) };
    }
};
