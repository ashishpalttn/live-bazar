const serverlessExpress = require('@vendia/serverless-express');
const app = require('./src/server'); // Your Express app

exports.handler = serverlessExpress({ app });
