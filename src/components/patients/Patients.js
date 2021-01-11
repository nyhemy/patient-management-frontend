import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import loadImg from '../ajax-loader.gif';
import Patient from '../patient/Patient';

const axios = require('axios').default;

const Patients = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setErrorMsg] = useState('');

  const [patients, setPatients] = useState([]);

  useEffect(() => {
    setErrorMsg('');
    setLoading(true);
    axios.get('http://localhost:8080/patients', {
      headers: {
        'Content-Type': 'application/json',
        mode: 'cors'
      }
    })
      .then((response) => {
        setLoading(false);
        setPatients(response.data);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
  }, []);

  const createPatient = () => {
    history.push('/patients/create');
  };

  return (
    <div>
      <h2>Patients</h2>
      {error && <h3>{error}</h3>}
      <div>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : !error && (
          <>
            <div><button type="button" onClick={createPatient}>Create</button></div>
            {patients.map((data) => (
              <div key={data}>
                <Patient
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
