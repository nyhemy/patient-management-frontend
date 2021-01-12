import { states } from './Constants';

const stateValidator = (state) => {
  let stateValid = false;

  for (let i = 0; i < states.length; i += 1) {
    if (states[i].toLowerCase() === state.toLowerCase()) {
      stateValid = true;
    }
  }

  return stateValid;
};

// eslint-disable-next-line import/prefer-default-export
export { stateValidator };
