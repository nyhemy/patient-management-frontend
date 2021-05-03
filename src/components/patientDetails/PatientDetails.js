/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Encounter from '../Encounter/Encounter';
import styles from './PatientDetails.module.css';
import loadImg from '../ajax-loader.gif';
// eslint-disable-next-line no-unused-vars
import { get } from '../Requests';
import { emailRegex, zipcodeRegex, ssnRegex } from '../Constants';
import { stateValidator, genderValidator } from '../Functions';

// const axios = require('axios').default;

/**
 * Shows and allows modification of specific Patient from database
 */
const PatientDetails = () => {
  // patient id retrieved from URL
  const { id } = useParams();

  // states used for general component functionality

  const [notFound, setNotFound] = useState(false);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');

  // state used to store encounters retrieved from database
  // eslint-disable-next-line no-unused-vars
  const [encounters, setEncounters] = useState([]);

  // states used to store form input
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ssn, setSsn] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipCode] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [insurance, setInsurance] = useState('');
  const [gender, setGender] = useState('');

  // states used to manage errors
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
   * Checks if id is valid and retrieves specific patient/encounters for the patient from database
   */
  // useEffect(() => {
  //   if (Number.isNaN(Number(id))) {
  //     setNotFound(true);
  //     setErrorMsg('404 Not Found');
  //   }
  // }, [id]);

  useEffect(() => {
    setLoading(true);
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line prefer-const

    // get(`http://localhost:8080/patients/${id}`)

    const patientsRequest = fetch(`http://localhost:8080/patients/${id}`, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    let encounterRequest;

    Promise.resolve(patientsRequest)
      .then((patientsResponse) => {
        setLoading(false);

        if (patientsResponse.ok) {
          encounterRequest = fetch(`http://localhost:8080/patients/${id}/encounters`, {
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          });

          Promise.resolve(encounterRequest)
            .then((encounterResponse) => {
              if (encounterResponse.ok) {
                return Promise.resolve(encounterResponse.json());
              }
              throw new Error(encounterResponse.status.toString());
            })
            .then((encounterData) => {
              setLoading(false);
              setEncounters(encounterData);
            })
            // eslint-disable-next-line no-unused-vars
            .catch((error) => {
              setLoading(false);
              setErrorMsg('Error with encounter');
            });
          return Promise.resolve(patientsResponse.json());
        }

        setNotFound(true);
        setErrorStatus(patientsResponse.status);
        throw new Error(patientsResponse.status.toString());
        // switch (patientsResponse.status) {
        //   case 404:
        //     setNotFound(true);
        //     setErrorStatus(404);
        //     break;
        //   default:
        //     setNotFound(true);
        //     break;
        // }

        // if (patientsResponse.status === 404) {
        //   setLoading(false);
        //   setNotFound(true);
        //   setErrorMsg('404 Not Found');
        // } else {
        //   setLoading(false);
        //   // eslint-disable-next-line no-unused-expressions
        //   Number.isNaN(Number(id)) ? setErrorMsg('404 Not Found') : setErrorMsg('Oops');
        // }
        // else if (error.request) {
        //   setLoading(false);
        //   setErrorMsg('Oops something went wrong');
        // }
      })
      .then((responseData) => {
        const res = responseData;
        // console.log(res);
        // console.log(`firstName: ${res.firstName}`);

        setFirstName(res.firstName);
        setLastName(res.lastName);
        setSsn(res.ssn);
        setEmail(res.email);
        setStreet(res.street);
        setCity(res.city);
        setState(res.state);
        setZipCode(res.postal);
        setAge(res.age);
        setHeight(res.height);
        setWeight(res.weight);
        setInsurance(res.insurance);
        setGender(res.gender);
      })
      .catch(() => {
        setLoading(false);

        // eslint-disable-next-line no-unused-expressions
        // eslint-disable-next-line max-len
        // Number.isNaN(Number(id)) ? setErrorMsg('Id not a number') : errorStatus ? setErrorMsg(`Error ${errorStatus}`) : setErrorMsg('Oops something went wrong');
        switch (errorStatus) {
          case 404:
            setErrorMsg('404 Not Found');
            break;
          case 400:
            Number.isNaN(Number(id)) ? setErrorMsg('Id not a number') : setErrorMsg('Oops something went wrong');
            break;
          case '':
            setErrorMsg('Oops something went wrong');
            break;
          default:
            setErrorMsg(`Error ${errorStatus}`);
            break;
        }
      });
  }, [errorStatus, id]);

  // useEffect(() => {
  //   // eslint-disable-next-line no-unused-expressions
  //   !notFound && get(`http://localhost:8080/patients/${id}/encounters`)
  //     .then((response) => {
  //       setLoading(false);
  //       setEncounters(response.data);
  //     })
  //     // eslint-disable-next-line no-unused-vars
  //     .catch((error) => {
  //       setLoading(false);
  //       setErrorMsg('Oops 2');
  //     });
  // }, [id, notFound]);

  // const getEncounter = () => get(`http://localhost:8080/patients/${id}/encounters`)
  //   .then((response) => {
  //     setLoading(false);
  //     setEncounters(response.data);
  //   })
  //   // eslint-disable-next-line no-unused-vars
  //   .catch((error) => {
  //     setLoading(false);
  //     setErrorMsg('Oops 2');
  //   });

  /**
   * Redirects to patient creation component
   */
  const createEncounter = () => {
    history.push(`/patients/${id}/encounters/create`);
  };

  /**
   * Redirects to patients component
   */
  const patients = () => {
    history.push('/patients');
  };

  /**
   * Clears all error states
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
   * Handles changes to input
   *
   * @param {event} event is input change event
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
   * Handles form submission event, including validation and API calls
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

    if (age === '' || age <= 0 || Number.isNaN(Number(age))) {
      setAgeError('Must be valid age');
      noValidate = true;
    }

    if (height === '' || height <= 0 || Number.isNaN(Number(height))) {
      setHeightError('Must be valid height');
      noValidate = true;
    }

    if (weight === '' || weight <= 0 || Number.isNaN(Number(weight))) {
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

    // axios.put(`http://localhost:8080/patients/${id}`,
    //   {
    //     id,
    //     firstName,
    //     lastName,
    //     ssn,
    //     email,
    //     street,
    //     city,
    //     state,
    //     postal: zipcode,
    //     age,
    //     height,
    //     weight,
    //     insurance,
    //     gender
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       mode: 'cors'
    //     }
    //   })

    const putData = {
      id,
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
    };

    const patientPut = fetch(`http://localhost:8080/patients/${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(putData)
    });

    Promise.resolve(patientPut)
      // eslint-disable-next-line no-unused-vars
      .then((putResponse) => {
        // console.log(putData);
        // console.log(putResponse);
        // if (putResponse.ok) {
        //   return Promise.resolve(putResponse.json());
        // }
        // throw new Error(putResponse.status.toString());
        if (putResponse.ok) {
          setLoading(false);
          history.push('/patients');
        }
        throw new Error(putResponse.status.toString());
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('PUT: Oops something went wrong');
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.center}>Patient Details</h2>
      <div className={styles.center}><button type="button" onClick={patients}>Back to Patients</button></div>
      <h3 className={styles.error}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg}
      </h3>

      {!notFound && (
      <form data-testid="form" className={styles.form} onSubmit={handleSubmit} noValidate>

        <h3 className={styles.center}>Edit Patient</h3>

        <div className={styles.input}>
          <span className={styles.left}>Id:</span>
          {' '}
          {id}
        </div>
        <div className={styles.inputError} />

        <div className={styles.input}>
          <span className={styles.left}>First Name:</span>
          {' '}
          <input data-testid="f-name" className={styles.right} value={firstName} name="firstName" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{firstNameError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Last Name:</span>
          {' '}
          <input data-testid="l-name" className={styles.right} value={lastName} name="lastName" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{lastNameError}</div>

        <div className={styles.input}>
          <span className={styles.left}>SSN:</span>
          {' '}
          <input data-testid="ssn" className={styles.right} value={ssn} name="ssn" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{ssnError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Email:</span>
          {' '}
          <input data-testid="email" className={styles.right} value={email} name="email" type="email" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{emailError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Street:</span>
          {' '}
          <input data-testid="street" className={styles.right} value={street} name="street" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{streetError}</div>

        <div className={styles.input}>
          <span className={styles.left}>City:</span>
          {' '}
          <input data-testid="city" className={styles.right} value={city} name="city" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{cityError}</div>

        <div className={styles.input}>
          <span className={styles.left}>State:</span>
          {' '}
          <input data-testid="state" className={styles.right} value={state} name="state" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{stateError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Zip Code:</span>
          {' '}
          <input data-testid="zipcode" className={styles.right} value={zipcode} name="zipcode" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{zipcodeError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Age:</span>
          {' '}
          <input data-testid="age" className={styles.right} value={age} name="age" type="number" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{ageError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Height:</span>
          {' '}
          <input data-testid="height" className={styles.right} value={height} name="height" type="number" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{heightError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Weight:</span>
          {' '}
          <input data-testid="weight" className={styles.right} value={weight} name="weight" type="number" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{weightError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Insurance:</span>
          {' '}
          <input data-testid="insurance" className={styles.right} value={insurance} name="insurance" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{insuranceError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Gender:</span>
          {' '}
          {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select data-testid="gender-select" value={gender} className={styles.select} name="gender" onChange={handleChange}>
            <option data-testid="DEFAULT-select" value="DEFAULT">--select gender--</option>
            <option data-testid="male-select" value="male">Male</option>
            <option data-testid="female-select" value="female">Female</option>
            <option data-testid="other-select" value="other">Other</option>
          </select>
        </div>
        <div className={styles.inputError}>{genderError}</div>

        <div className={styles.button}><button type="submit">Submit</button></div>
      </form>
      )}
      <div className={styles.encounterPadding}>
        <h3 className={styles.center}>Encounters</h3>
        <div className={styles.center}><button type="button" onClick={createEncounter}>Create Encounter</button></div>
      </div>

      {encounters.map((data) => (
        <div className={styles.column} key={data.id}>
          <Encounter
            id={data.id}
            patientId={data.patientId}
            visitCode={data.visitCode}
            provider={data.provider}
            date={data.date}
          />
        </div>
      ))}
    </div>
  );
};

export default PatientDetails;
