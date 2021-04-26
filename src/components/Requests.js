const axios = require('axios').default;

/**
 * Axios get request
 *
 * @param {string} endpoint is the endpoint to which the get request is made
 */
const get = (endpoint) => axios.get(endpoint, {
  headers: {
    'Content-Type': 'application/json'
    // mode: 'cors'
  }
});

// eslint-disable-next-line import/prefer-default-export
export { get };
