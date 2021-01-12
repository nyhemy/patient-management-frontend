import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import loadImg from '../ajax-loader.gif';
import styles from './CreatePatient.module.css';

const axios = require('axios').default;

const CreatePatient = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
  const [weight, setWeight] = useState(0);
  const [insurance, setInsurance] = useState('');
  const [gender, setGender] = useState('');

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

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <h2>Create Patient</h2>
      <h3 className={styles.error}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg}
      </h3>
      <>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.input}><input type="text" name="firstName" placeholder="first name" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="lastName" placeholder="last name" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="ssn" placeholder="social security number" onChange={handleChange} /></div>
          <div className={styles.input}><input type="email" name="email" placeholder="email" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="street" placeholder="street" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="city" placeholder="city" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="state" placeholder="state" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="zipcode" placeholder="zipcode" onChange={handleChange} /></div>
          <div className={styles.input}><input type="number" name="age" placeholder="age" onChange={handleChange} /></div>
          <div className={styles.input}><input type="number" name="height" placeholder="height" onChange={handleChange} /></div>
          <div className={styles.input}><input type="number" name="weight" placeholder="weight" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="insurance" placeholder="insurance" onChange={handleChange} /></div>
          <div className={styles.input}><input type="text" name="gender" placeholder="gender" onChange={handleChange} /></div>
        </form>
      </>
    </div>
  );
};

export default CreatePatient;
