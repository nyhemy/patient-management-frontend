import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import loadImg from '../ajax-loader.gif';
import styles from './CreateEncounter.module.css';
import {
  visitCodeRegex, billingCodeRegex, icd10Regex, dateRegex
} from '../Constants';
import { get } from '../Requests';

const axios = require('axios').default;

const CreateEncounter = () => {
  const { id } = useParams();

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [notFound, setNotFound] = useState(false);

  const [notes, setNotes] = useState('');
  const [visitCode, setVisitCode] = useState('');
  const [provider, setProvider] = useState('');
  const [billingCode, setBillingCode] = useState('');
  const [icd10, setIcd10] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [copay, setCopay] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [pulse, setPulse] = useState(0);
  const [systolic, setSystolic] = useState(0);
  const [diastolic, setDiastolic] = useState(0);
  const [date, setDate] = useState('');

  const [visitCodeError, setVisitCodeError] = useState('');
  const [providerError, setProviderError] = useState('');
  const [billingCodeError, setBillingCodeError] = useState('');
  const [icd10Error, setIcd10Error] = useState('');
  const [totalCostError, setTotalCostError] = useState('');
  const [copayError, setCopayError] = useState('');
  const [chiefComplaintError, setChiefComplaintError] = useState('');
  const [pulseError, setPulseError] = useState('');
  const [systolicError, setSystolicError] = useState('');
  const [diastolicError, setDiastolicError] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (Number.isNaN(Number(id))) {
      setNotFound(true);
    }

    setLoading(true);
    get(`http://localhost:8080/patients/${id}`)
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setLoading(false);
            setNotFound(true);
            setErrorMsg('404 Patient Not Found');
          } else {
            setLoading(false);
            // eslint-disable-next-line no-unused-expressions
            Number.isNaN(Number(id)) ? setErrorMsg('404 Patient Not Found') : setErrorMsg('Oops something went wrong');
          }
        } else if (error.request) {
          setLoading(false);
          setErrorMsg('Oops something went wrong');
        }
      });
  }, [id]);

  const clearErrors = () => {
    setVisitCodeError('');
    setProviderError('');
    setBillingCodeError('');
    setIcd10Error('');
    setTotalCostError('');
    setCopayError('');
    setChiefComplaintError('');
    setPulseError('');
    setSystolicError('');
    setDiastolicError('');
    setDateError('');
  };

  const handleChange = (event) => {
    switch (event.target.name) {
      case 'notes':
        setNotes(event.target.value);
        break;
      case 'visitCode':
        setVisitCode(event.target.value);
        break;
      case 'provider':
        setProvider(event.target.value);
        break;
      case 'billingCode':
        setBillingCode(event.target.value);
        break;
      case 'icd10':
        setIcd10(event.target.value);
        break;
      case 'totalCost':
        setTotalCost(event.target.value);
        break;
      case 'copay':
        setCopay(event.target.value);
        break;
      case 'chiefComplaint':
        setChiefComplaint(event.target.value);
        break;
      case 'pulse':
        setPulse(event.target.value);
        break;
      case 'systolic':
        setSystolic(event.target.value);
        break;
      case 'diastolic':
        setDiastolic(event.target.value);
        break;
      case 'date':
        setDate(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    clearErrors();
    let noValidate = false;

    if (visitCode === '' || !visitCode.trim().length || !visitCodeRegex.test(visitCode)) {
      setVisitCodeError('Must be valid visit code');
      noValidate = true;
    }

    if (provider === '' || !provider.trim().length) {
      setProviderError('Must be valid provider');
      noValidate = true;
    }

    if (billingCode === '' || !billingCode.trim().length || !billingCodeRegex.test(billingCode)) {
      setBillingCodeError('Must be valid billing code');
      noValidate = true;
    }

    if (icd10 === '' || !icd10.trim().length || !icd10Regex.test(icd10)) {
      setIcd10Error('Must be valid icd10');
      noValidate = true;
    }

    if (totalCost === '' || totalCost < 0 || Number.isNaN(Number(totalCost))) {
      setTotalCostError('Must be valid total cost');
      noValidate = true;
    }

    if (copay === '' || copay < 0 || Number.isNaN(Number(copay))) {
      setCopayError('Must be valid copay');
      noValidate = true;
    }

    if (chiefComplaint === '' || !chiefComplaint.trim().length) {
      setChiefComplaintError('Must be valid chief complaint');
      noValidate = true;
    }

    if (Number.isNaN(Number(pulse))) {
      setPulseError('Must be valid pulse');
      noValidate = true;
    }

    if (Number.isNaN(Number(systolic))) {
      setSystolicError('Must be valid systolic');
      noValidate = true;
    }

    if (Number.isNaN(Number(diastolic))) {
      setDiastolicError('Must be valid diastolic');
      noValidate = true;
    }

    if (date === '' || !date.trim().length || !dateRegex.test(date)) {
      setDateError('Must be valid date');
      noValidate = true;
    }

    if (noValidate) {
      return;
    }

    setLoading(true);

    axios.post(`http://localhost:8080/patients/${id}/encounters`,
      {
        patientId: id,
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
      },
      {
        headers: {
          'Content-Type': 'application/json',
          mode: 'cors'
        }
      })
      // eslint-disable-next-line no-unused-vars
      .then((response) => {
        setLoading(false);
        history.push(`/patients/${id}`);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((error) => {
        setLoading(false);
        setErrorMsg('Oops something went wrong');
      });
  };
  return (
    <div className={styles.container}>
      <h2>Create Encounter</h2>
      <h3 className={styles.error}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg}
      </h3>
      {!notFound && (
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.input}>
          <input type="text" name="notes" placeholder="notes" onChange={handleChange} />
          {' '}
          <input type="text" name="visitCode" placeholder="visit code" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorLeft} />
          {' '}
          <div className={styles.inputErrorRight}>{visitCodeError}</div>
        </div>

        <div className={styles.input}>
          <input type="text" name="provider" placeholder="provider" onChange={handleChange} />
          {' '}
          <input type="text" name="billingCode" placeholder="billing code" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorRight}>{providerError}</div>
          {' '}
          <div className={styles.inputErrorRight}>{billingCodeError}</div>
        </div>

        <div className={styles.input}>
          <input type="text" name="icd10" placeholder="icd10" onChange={handleChange} />
          {' '}
          <input type="number" name="totalCost" placeholder="total cost" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorRight}>{icd10Error}</div>
          {' '}
          <div className={styles.inputErrorRight}>{totalCostError}</div>
        </div>

        <div className={styles.input}>
          <input type="number" name="copay" placeholder="copay" onChange={handleChange} />
          {' '}
          <input type="text" name="chiefComplaint" placeholder="chief complaint" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorRight}>{copayError}</div>
          {' '}
          <div className={styles.inputErrorRight}>{chiefComplaintError}</div>
        </div>

        <div className={styles.input}>
          <input type="number" name="pulse" placeholder="pulse" onChange={handleChange} />
          {' '}
          <input type="number" name="systolic" placeholder="systolic" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorRight}>{pulseError}</div>
          {' '}
          <div className={styles.inputErrorRight}>{systolicError}</div>
        </div>

        <div className={styles.input}>
          <input type="number" name="diastolic" placeholder="diastolic" onChange={handleChange} />
          {' '}
          <input type="date" name="date" placeholder="date" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>
          <div className={styles.inputErrorRight}>{diastolicError}</div>
          {' '}
          <div className={styles.inputErrorRight}>{dateError}</div>
        </div>

        <button type="submit">Create</button>
      </form>
      )}
    </div>
  );
};

export default CreateEncounter;
