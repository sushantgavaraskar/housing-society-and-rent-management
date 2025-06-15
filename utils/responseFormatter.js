// utils/responseFormatter.js

const formatResponse = ({ success = true, message = '', data = null, statusCode = 200 }) => {
    return {
      success,
      message,
      data,
      statusCode
    };
  };
  
  module.exports = formatResponse;