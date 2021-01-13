const axios = require('axios').default;

const get = (endpoint) => axios.get(endpoint, {
  headers: {
    'Content-Type': 'application/json',
    mode: 'cors'
  }
});

// eslint-disable-next-line import/prefer-default-export
export { get };
