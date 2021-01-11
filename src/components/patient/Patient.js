import React from 'react';

const Patient = (props) => {
  const {
    firstName, lastName, age, gender
  } = props;

  return (
    <div>
      <div>
        Name:
        {`${firstName} ${lastName}`}
      </div>
      <div>
        Age:
        {age}
      </div>
      <div>
        Gender:
        {gender}
      </div>
    </div>
  );
};

export default Patient;
