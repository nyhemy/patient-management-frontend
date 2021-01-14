import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
// eslint-disable-next-line import/no-unresolved
import styles from './EncounterDetails.module.css';
import loadImg from '../ajax-loader.gif';
import { get } from '../Requests';
import {
  visitCodeRegex, billingCodeRegex, icd10Regex, dateRegex
} from '../Constants';

const axios = require('axios').default;

const EncounterDetails = () => {
  const { id, encounterId } = useParams();

  const [notFound, setNotFound] = useState(false);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [notes, setNotes] = useState('');
  const [visitCode, setVisitCode] = useState('');
  const [provider, setProvider] = useState('');
  const [billingCode, setBillingCode] = useState('');
  const [icd10, setIcd10] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [copay, setCopay] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [pulse, setPulse] = useState('');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
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
      setErrorMsg('404 Not Found');
    }

    setLoading(true);
    get(`http://localhost:8080/encounters/${encounterId}`)
      .then((response) => {
        const res = response.data;
        setLoading(false);

        if (res.patientId !== Number(id)) {
          setNotFound(true);
          setErrorMsg('404 Not Found');
        }
        setNotes(res.notes);
        setVisitCode(res.visitCode);
        setProvider(res.provider);
        setBillingCode(res.billingCode);
        setIcd10(res.icd10);
        setTotalCost(res.totalCost);
        setCopay(res.copay);
        setChiefComplaint(res.chiefComplaint);
        setPulse(res.pulse);
        setSystolic(res.systolic);
        setDiastolic(res.diastolic);
        setDate(res.date);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            setLoading(false);
            setNotFound(true);
            setErrorMsg('404 Not Found');
          } else {
            setLoading(false);
            // eslint-disable-next-line no-unused-expressions
            (Number.isNaN(Number(id)) || Number.isNaN(Number(encounterId)))
              ? setErrorMsg('404 Not Found')
              : setErrorMsg('Oops something went wrong');
          }
        } else if (error.request) {
          setLoading(false);
          setErrorMsg('Oops something went wrong');
        }
      });
  }, [encounterId, id, notes]);

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

    axios.put(`http://localhost:8080/patients/${id}/encounters/${encounterId}`,
      {
        id: encounterId,
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
      <h2 className={styles.center}>Encounter Details</h2>
      <h3 className={styles.error}>
        {loading
          ? <img src={loadImg} alt="loading..." />
          : errorMsg}
      </h3>
      {!notFound && (
      <form className={styles.form} onSubmit={handleSubmit} noValidate>

        <h3 className={styles.center}>Edit Encounter</h3>

        <div className={styles.input}>
          <span className={styles.left}>Id:</span>
          {' '}
          {id}
        </div>
        <div className={styles.inputError} />

        <div className={styles.input}>
          <span className={styles.left}>Notes:</span>
          {' '}
          <input className={styles.right} value={notes} name="notes" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError} />

        <div className={styles.input}>
          <span className={styles.left}>Visit Code:</span>
          {' '}
          <input className={styles.right} value={visitCode} name="visitCode" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{visitCodeError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Provider:</span>
          {' '}
          <input className={styles.right} value={provider} name="provider" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{providerError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Billing Code:</span>
          {' '}
          <input className={styles.right} value={billingCode} name="billingCode" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{billingCodeError}</div>

        <div className={styles.input}>
          <span className={styles.left}>ICD10:</span>
          {' '}
          <input className={styles.right} value={icd10} name="icd10" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{icd10Error}</div>

        <div className={styles.input}>
          <span className={styles.left}>Total Cost:</span>
          {' '}
          <input className={styles.right} value={totalCost} name="totalCost" type="number" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{totalCostError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Copay:</span>
          {' '}
          <input className={styles.right} value={copay} name="copay" type="number" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{copayError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Chief Complaint:</span>
          {' '}
          <input className={styles.right} value={chiefComplaint} name="chiefComplaint" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{chiefComplaintError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Pulse:</span>
          {' '}
          <input className={styles.right} value={pulse} name="pulse" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{pulseError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Systolic:</span>
          {' '}
          <input className={styles.right} value={systolic} name="systolic" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{systolicError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Diastolic:</span>
          {' '}
          <input className={styles.right} value={diastolic} name="diastolic" type="text" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{diastolicError}</div>

        <div className={styles.input}>
          <span className={styles.left}>Date:</span>
          {' '}
          <input className={styles.right} value={date} name="date" type="date" onChange={handleChange} />
        </div>
        <div className={styles.inputError}>{dateError}</div>

        <div className={styles.button}><button type="submit">Submit</button></div>
      </form>
      )}
    </div>
  );
};

export default EncounterDetails;
