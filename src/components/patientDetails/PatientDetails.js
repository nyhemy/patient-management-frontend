/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { get } from '../Requests';
import Encounter from '../Encounter/Encounter';
import styles from './PatientDetails.module.css';

const axios = require('axios').default;

const PatientDetails = () => {
  const { id } = useParams();

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const [encounters, setEncounters] = useState([]);

  useEffect(() => {
    if (Number.isNaN(Number(id))) {
      setNotFound(true);
    }

    setLoading(true);
    setErrorMsg('');
    get(`patients/${id}/encounters`)
      .then((response) => {
        setLoading(false);
        setEncounters(response.data);
      })
    // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
  }, [history, id]);
  return (
    <div>
      {encounters.map((data) => (
        <div className={styles.column} key={data.id}>
          <Encounter
            id={data.id}
            visitCode={data.visitCode}
            provider={data.provider}
            data={data.date}
          />
        </div>
      ))}
    </div>
  );
};

export default PatientDetails;
