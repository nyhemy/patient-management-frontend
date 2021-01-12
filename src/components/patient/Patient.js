import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import styles from './Patient.module.css';
import loadImg from '../ajax-loader.gif';

const axios = require('axios').default;

const Patient = (props) => {
  const {
    id, firstName, lastName, age, gender
  } = props;

  // const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deletePatient = () => {
    setLoading(true);
    axios.delete(`http://localhost:8080/patients/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        mode: 'cors',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      },
      data: {
        id
      }
    })
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        setLoading(false);
        window.location.reload();
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
  };

  return (
    <div className={styles.card}>
      {errorMsg !== '' && <h2 className={styles.notification}>{errorMsg}</h2>}
      {loading
        ? <img src={loadImg} alt="loading..." />
        : errorMsg === '' && (
        <div>
          <div>
            Name:
            {` ${firstName} ${lastName}`}
          </div>
          <div>
            Age:
            {` ${age}`}
          </div>
          <div>
            Gender:
            {` ${gender}`}
          </div>
          <div>
            <button type="button">select</button>
            <button type="button" onClick={deletePatient}>Delete</button>
          </div>
        </div>
        )}
    </div>
  );
};

export default Patient;
