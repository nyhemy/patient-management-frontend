import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './Encounter.module.css';

/**
 * Component which takes data from backend Encounter entity and displays it
 *
 * @param {*} props are props passed to component when it is called
 */
const Encounter = (props) => {
  const {
    id,
    patientId,
    visitCode,
    provider,
    date
  } = props;

  const history = useHistory();

  /**
   * Redirects to EncounterDetails
   */
  const encounterDetails = () => {
    history.push(`/patients/${patientId}/encounters/${id}`);
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
