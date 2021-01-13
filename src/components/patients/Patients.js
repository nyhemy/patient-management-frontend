import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import loadImg from '../ajax-loader.gif';
import styles from './Patients.module.css';
import { get } from '../Requests';
import Patient from '../patient/Patient';

const Patients = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setErrorMsg('');
    setLoading(true);
    get('http://localhost:8080/patients')
      .then((response) => {
        setLoading(false);
        setPatients(response.data);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
  }, []);

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
            <div><button type="button" onClick={createPatient}>Create</button></div>
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
