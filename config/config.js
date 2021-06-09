const dotenv = require('dotenv');
const path = require('path');
if (process.env && process.env.NODE_ENV) {
  dotenv.config({path: '.env.' + process.env.NODE_ENV});
} else {
  dotenv.config({path: '.env.development'});
}
