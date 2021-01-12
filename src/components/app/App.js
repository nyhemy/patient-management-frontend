import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Patients from '../patients/Patients';
import CreatePatients from '../createPatient/CreatePatient';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/patients" component={Patients} />
      <Route exact path="/patients/create" component={CreatePatients} />
    </Switch>
  </Router>
);

export default App;
