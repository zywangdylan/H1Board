const serverConfig = require('./config.json');

module.exports = {
  ...serverConfig,
  API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
};
