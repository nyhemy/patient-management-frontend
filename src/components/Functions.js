import { states, validGenders } from './Constants';

const stateValidator = (state) => {
  let stateValid = false;

  for (let i = 0; i < states.length; i += 1) {
    if (states[i].toLowerCase() === state.toLowerCase()) {
      stateValid = true;
    }
  }

  return stateValid;
};

const genderValidator = (gender) => {
  let genderValid = false;

  for (let i = 0; i < validGenders.length; i += 1) {
    if (validGenders[i] === gender) {
      genderValid = true;
    }
  }

  return genderValid;
};

// eslint-disable-next-line import/prefer-default-export
export { stateValidator, genderValidator };
