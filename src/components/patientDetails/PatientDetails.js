import React from 'react';
import { useParams } from 'react-router-dom';

const PatientDetails = () => {
  const { id } = useParams();

  return (
    <div>{id}</div>
  );
};

export default PatientDetails;
