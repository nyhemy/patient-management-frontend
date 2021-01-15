import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import loadImg from '../ajax-loader.gif';
import styles from './CreatePatient.module.css';
import { emailRegex, zipcodeRegex, ssnRegex } from '../Constants';
import { stateValidator, genderValidator } from '../Functions';

const axios = require('axios').default;

const CreatePatient = () => {
  // states used for general component functionality
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // states used for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ssn, setSsn] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipCode] = useState('');
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState('');
  const [insurance, setInsurance] = useState('');
  const [gender, setGender] = useState('');

  // states used for error handling
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [ssnError, setSsnError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [streetError, setStreetError] = useState('');
  const [cityError, setCityError] = useState('');
  const [stateError, setStateError] = useState('');
  const [zipcodeError, setZipCodeError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [heightError, setHeightError] = useState('');
  const [weightError, setWeightError] = useState('');
  const [insuranceError, setInsuranceError] = useState('');
  const [genderError, setGenderError] = useState('');

  /**
   * clears all error states
   */
  const clearErrors = () => {
    setFirstNameError('');
    setLastNameError('');
    setSsnError('');
    setEmailError('');
    setStreetError('');
    setCityError('');
    setStateError('');
    setZipCodeError('');
    setAgeError('');
    setHeightError('');
    setWeightError('');
    setInsuranceError('');
    setGenderError('');
  };

  /**
   * Handles changes to inputs
   *
   * @param {event} event is when input changes its value
   */
  const handleChange = (event) => {
    switch (event.target.name) {
      case 'firstName':
        setFirstName(event.target.value);
        break;
      case 'lastName':
        setLastName(event.target.value);
        break;
      case 'ssn':
        setSsn(event.target.value);
        break;
      case 'email':
        setEmail(event.target.value);
        break;
      case 'street':
        setStreet(event.target.value);
        break;
      case 'city':
        setCity(event.target.value);
        break;
      case 'state':
        setState(event.target.value);
        break;
      case 'zipcode':
        setZipCode(event.target.value);
        break;
      case 'age':
        setAge(event.target.value);
        break;
      case 'height':
        setHeight(event.target.value);
        break;
      case 'weight':
        setWeight(event.target.value);
        break;
      case 'insurance':
        setInsurance(event.target.value);
        break;
      case 'gender':
        setGender(event.target.value);
        break;
      default:
        break;
    }
  };

  /**
   * Handles form submission event, including validaion and API calls
   *
   * @param {event} event is the form submission event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    clearErrors();
    let noValidate = false;

    if (firstName === '' || !firstName.trim().length) {
      setFirstNameError('Must be valid first name');
      noValidate = true;
    }

    if (lastName === '' || !lastName.trim().length) {
      setLastNameError('Must be valid last name');
      noValidate = true;
    }

    if (ssn === '' || !ssn.trim().length || !ssnRegex.test(ssn)) {
      setSsnError('Must be valid ssn');
      noValidate = true;
    }

    if (email === '' || !email.trim().length || !emailRegex.test(email)) {
      setEmailError('Must be valid email');
      noValidate = true;
    }

    if (street === '' || !street.trim().length) {
      setStreetError('Must be valid street');
      noValidate = true;
    }

    if (city === '' || !city.trim().length) {
      setCityError('Must be valid city');
      noValidate = true;
    }

    if (state === '' || !state.trim().length || !stateValidator(state)) {
      setStateError('Must be valid state');
      noValidate = true;
    }

    if (zipcode === '' || !zipcode.trim().length || !zipcodeRegex.test(zipcode)) {
      setZipCodeError('Must be valid zipcode');
      noValidate = true;
    }

    if (age <= 0 || Number.isNaN(Number(age))) {
      setAgeError('Must be valid age');
      noValidate = true;
    }

    if (height <= 0 || Number.isNaN(Number(height))) {
      setHeightError('Must be valid height');
      noValidate = true;
    }

    if (weight <= 0 || Number.isNaN(Number(weight))) {
      setWeightError('Must be valid weight');
      noValidate = true;
    }

    if (insurance === '' || !insurance.trim().length) {
      setInsuranceError('Must be valid insurance');
      noValidate = true;
    }

    if (gender === '' || !gender.trim().length || !genderValidator(gender)) {
      setGenderError('Must be valid gender');
      noValidate = true;
    }

    if (noValidate) {
      return;
    }

    setLoading(true);

    axios.post('http://localhost:8080/patients',
      {
        firstName,
        lastName,
        ssn,
        email,
        street,
        city,
        state,
        postal: zipcode,
        age,
        height,
        weight,
        insurance,
        gender
      },
      {
        headers: {
          'Content-Type': 'application/json',
          mode: 'cors',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        setLoading(false);
        history.push('/patients');
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
  };

  return (
    <div className={styles.container}>
      <h2>Create Patient</h2>
      <h3 className={styles.error}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg}
      </h3>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.input}>
          <input type="text" name="firstName" placeholder="first name" onChange={handleChange} />
          {' '}
          <input type="text" name="lastName" placeholder="last name" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorLeft}>{firstNameError}</div>
          {' '}
          <div className={styles.inputErrorRight}>{lastNameError}</div>
        </div>

        <div className={styles.input}>
          <input type="text" name="ssn" placeholder="social security number" onChange={handleChange} />
          {' '}
          <input type="email" name="email" placeholder="email" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <span className={styles.inputErrorLeft}>{ssnError}</span>
          {' '}
          <span className={styles.inputErrorRight}>{emailError}</span>
        </div>

        <div className={styles.input}>
          <input type="text" name="street" placeholder="street" onChange={handleChange} />
          {' '}
          <input type="text" name="city" placeholder="city" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <span className={styles.inputErrorLeft}>{streetError}</span>
          {' '}
          <span className={styles.inputErrorRight}>{cityError}</span>
        </div>

        <div className={styles.input}>
          <input type="text" name="state" placeholder="state" onChange={handleChange} />
          {' '}
          <input type="text" name="zipcode" placeholder="zipcode" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <span className={styles.inputErrorLeft}>{stateError}</span>
          {' '}
          <span className={styles.inputErrorRight}>{zipcodeError}</span>
        </div>

        <div className={styles.input}>
          <input type="number" name="age" placeholder="age" onChange={handleChange} />
          {' '}
          <input type="number" name="height" placeholder="height" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <span className={styles.inputErrorLeft}>{ageError}</span>
          {' '}
          <span className={styles.inputErrorRight}>{heightError}</span>
        </div>

        <div className={styles.input}>
          <input type="number" name="weight" placeholder="weight" onChange={handleChange} />
          {' '}
          <input type="text" name="insurance" placeholder="insurance" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <span className={styles.inputErrorLeft}>{weightError}</span>
          {' '}
          <span className={styles.inputErrorRight}>{insuranceError}</span>
        </div>

        <div>
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select defaultValue="DEFAULT" className={styles.select} name="gender" onChange={handleChange}>
            <option value="DEFAULT">--select gender--</option>
            <option value="male">Male</option>
            <option value="memale">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={styles.inputError}>{genderError}</div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePatient;
