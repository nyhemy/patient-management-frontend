/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { get } from '../Requests';
import Encounter from '../Encounter/Encounter';
import styles from './PatientDetails.module.css';
import loadImg from '../ajax-loader.gif';

const axios = require('axios').default;

const PatientDetails = () => {
  const { id } = useParams();

  const [notFound, setNotFound] = useState(false);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [encounters, setEncounters] = useState([]);

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
  const [weight, setWeight] = useState('potato');
  const [insurance, setInsurance] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    if (Number.isNaN(Number(id))) {
      setNotFound(true);
    }

    setLoading(true);
    setErrorMsg('');

    get(`patients/${id}`)
      .then((response) => {
        const res = response.data;

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
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setNotFound(true);
            setErrorMsg('404 Not Found');
          } else {
            // eslint-disable-next-line no-unused-expressions
            Number.isNaN(Number(id)) ? setErrorMsg('404 Not Found') : setErrorMsg('Oops something went wrong');
          }
        } else if (error.request) {
          setErrorMsg('Oops something went wrong');
        }
      });

    get(`patients/${id}/encounters`)
      .then((response) => {
        setEncounters(response.data);
      })
    // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });

    setLoading(false);
  }, [history, id]);

  const handleChange = (event) => {
    switch (event.target.name) {
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.center}>Patient Details</h2>
      <h3 className={styles.error}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg}
      </h3>

      {!notFound && (
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        <div className={styles.input}>
          <span className={styles.left}>Id:</span>
          {' '}
          {id}
        </div>

        <div className={styles.input}>
          <span className={styles.left}>First Name:</span>
          {' '}
          <input className={styles.right} value={firstName} name="firstName" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Last Name:</span>
          {' '}
          <input className={styles.right} value={lastName} name="lastName" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>SSN:</span>
          {' '}
          <input className={styles.right} value={ssn} name="ssn" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Email:</span>
          {' '}
          <input className={styles.right} value={email} name="email" type="email" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Street:</span>
          {' '}
          <input className={styles.right} value={street} name="street" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>City:</span>
          {' '}
          <input className={styles.right} value={city} name="city" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>State:</span>
          {' '}
          <input className={styles.right} value={state} name="state" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Zip Code:</span>
          {' '}
          <input className={styles.right} value={zipcode} name="zipcode" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Age:</span>
          {' '}
          <input className={styles.right} value={age} name="age" type="number" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Height:</span>
          {' '}
          <input className={styles.right} value={height} name="height" type="number" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Weight:</span>
          {' '}
          <input className={styles.right} value={weight} name="weight" type="number" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Insurance:</span>
          {' '}
          <input className={styles.right} value={insurance} name="insurance" type="text" onChange={handleChange} />
        </div>

        <div className={styles.input}>
          <span className={styles.left}>Gender:</span>
          {' '}
          <input className={styles.right} value={gender} name="gender" type="text" onChange={handleChange} />
        </div>

        <div className={styles.center}><button type="submit">Edit</button></div>
      </form>
      )}
      <div className={styles.encounterPadding}>
        <h3 className={styles.center}>Encounters:</h3>
        <div className={styles.center}><button type="button">Create Encounter</button></div>
      </div>

      {encounters.map((data) => (
        <div className={styles.column} key={data.id}>
          <Encounter
            id={data.id}
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
