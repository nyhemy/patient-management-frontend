import React from 'react';
import { useParams } from 'react-router-dom';

const CreateEncounter = () => {
  const { id } = useParams();
  return (
    <div>{id}</div>
  );
};

export default CreateEncounter;
