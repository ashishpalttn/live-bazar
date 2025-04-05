const serverlessExpress = require('@vendia/serverless-express');
const app = require('./server'); // Your Express app

exports.handler = async (event, context) => {
    console.log("Event:", JSON.stringify(event));
    console.log("Context:", JSON.stringify(context));
    const handler = serverlessExpress({ app });
    return handler(event, context);
  };
