import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Patient.module.css';
import loadImg from '../ajax-loader.gif';

const axios = require('axios').default;

/**
 * Component which takes data from backend Patient entity and displays it
 *
 * @param {*} props are props passed to component when it is called
 */
const Patient = (props) => {
  const {
    id, firstName, lastName, age, gender
  } = props;

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Redirects to PatientDetails
   */
  const patientDetails = () => {
    history.push(`/patients/${id}`);
  };

  /**
   * Handles delete request for Patient to API
   */
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
        if (error.response) {
          switch (error.response.status) {
            case 409:
              setErrorMsg('Cannot delete patient with existing encounters');
              break;
            default:
              setErrorMsg('Oops something went wrong');
              break;
          }
        } else {
          setErrorMsg('Oops something went wrong');
        }
      });
  };

  return (
    <div className={styles.card}>
      {loading
        ? <img src={loadImg} alt="loading..." />
        : (
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
              <button type="button" onClick={patientDetails}>Select</button>
              <button type="button" onClick={deletePatient}>Delete</button>
            </div>
          </div>
        )}
      {errorMsg !== '' && <h2 className={styles.notification}>{errorMsg}</h2>}
    </div>
  );
};

export default Patient;
