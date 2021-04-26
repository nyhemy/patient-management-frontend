import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import loadImg from '../ajax-loader.gif';
import styles from './Patients.module.css';
// import { get } from '../Requests';
import Patient from '../patient/Patient';

const Patients = () => {
  // states used for general component functionality
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // stores patients retrieved from database
  const [patients, setPatients] = useState([]);

  /**
   * Retrieves patients from database
   */
  useEffect(() => {
    setErrorMsg('');
    setLoading(true);
    const patientsRequest = fetch('http://localhost:8080/patients', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });

    Promise.resolve(patientsRequest)
      .then((encounterResponse) => {
        if (encounterResponse.ok) {
          return Promise.resolve(encounterResponse.json());
        }
        throw new Error(encounterResponse.status.toString());
      }).then((encounterData) => {
        setLoading(false);
        setPatients(encounterData);
      }).catch(() => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
    // get('http://localhost:8080/patients')
    //   .then((response) => {
    //     setLoading(false);
    //     setPatients(response.data);
    //   })
    //   // eslint-disable-next-line no-unused-vars
    //   .catch((error) => {
    //     setLoading(false);
    //     setErrorMsg('Oops something went wrong');
    //   });
  }, []);

  /**
   * Redirects to patient creation component
   */
  const createPatient = () => {
    history.push('/patients/create');
  };

  return (
    <div className={styles.center}>
      <h2>Patients</h2>
      {errorMsg && <h3 className={styles.error}>{errorMsg}</h3>}
      <div className={styles.row}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg === '' && (
          <>
            <div data-testid="patient-card"><button type="button" onClick={createPatient}>Create</button></div>
            {patients.map((data) => (
              <div className={styles.column} key={data.id}>
                <Patient
                  id={data.id}
                  firstName={data.firstName}
                  lastName={data.lastName}
                  age={data.age}
                  gender={data.gender}
                />
              </div>
            ))}
          </>
          )}
      </div>
    </div>
  );
};

export default Patients;
