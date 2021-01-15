import { states, validGenders } from './Constants';

/**
 * Checks if string matches valid state acronym
 *
 * @param {string} state is a two character string that should match a state acronym
 */
const stateValidator = (state) => {
  let stateValid = false;

  for (let i = 0; i < states.length; i += 1) {
    if (states[i].toLowerCase() === state.toLowerCase()) {
      stateValid = true;
    }
  }

  return stateValid;
};

/**
 * Checks if a provided string matches valid genders
 *
 * @param {string} gender is a string that should match a valid gender
 */
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
