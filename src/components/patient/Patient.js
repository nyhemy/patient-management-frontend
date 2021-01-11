import React from 'react';
import styles from './Patient.module.css';

const Patient = (props) => {
  const {
    firstName, lastName, age, gender
  } = props;

  return (
    <div className={styles.card}>
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
      <div><button type="button">edit</button></div>
    </div>
  );
};

export default Patient;
