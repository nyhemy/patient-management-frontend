import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Patients from '../patients/Patients';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/patients" component={Patients} />
    </Switch>
  </Router>
);

export default App;
