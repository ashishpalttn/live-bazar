const serverlessExpress = require('@vendia/serverless-express');
const app = require('./server'); // Your Express app

exports.handler = serverlessExpress({ app, log: true,  });
