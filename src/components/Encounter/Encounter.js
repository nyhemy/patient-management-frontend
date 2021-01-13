/* eslint-disable no-unused-vars */
import React from 'react';
import styles from './Encounter.module.css';

const Encounter = (props) => {
  const {
    id,
    patientId,
    notes,
    visitCode,
    provider,
    billingCode,
    icd10,
    totalCost,
    copay,
    chiefComplaint,
    pulse,
    systolic,
    diastolic,
    date
  } = props;

  const encounterDetails = () => {

  };

  return (
    <div className={styles.card}>
      <div>
        <div>
          Id:
          {` ${id}`}
        </div>
        <div>
          Visit Code:
          {` ${visitCode}`}
        </div>
        <div>
          Provider:
          {` ${provider}`}
        </div>
        <div>
          Date:
          {` ${date}`}
        </div>
        <div>
          <button type="button" onClick={encounterDetails}>Details</button>
        </div>
      </div>
    </div>
  );
};

export default Encounter;
