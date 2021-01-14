const emailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NH', 'NY', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

const ssnRegex = RegExp(/^\d{3}-\d{2}-\d{4}$/i);

const zipcodeRegex = RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/i);

const validGenders = ['male', 'female', 'other'];

const visitCodeRegex = RegExp(/\S\d\S \d\S\d/i);

const billingCodeRegex = RegExp(/\d{3}.\d{3}.\d{3}-\d{2}/i);

const icd10Regex = RegExp(/\S\d\d/i);

const dateRegex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/i);

export {
  emailRegex,
  states,
  ssnRegex,
  zipcodeRegex,
  validGenders,
  visitCodeRegex,
  billingCodeRegex,
  icd10Regex,
  dateRegex
};
