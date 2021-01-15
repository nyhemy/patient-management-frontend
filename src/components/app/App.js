import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Patients from '../patients/Patients';
import CreatePatients from '../createPatient/CreatePatient';
import PatientDetails from '../patientDetails/PatientDetails';
import EncounterDetails from '../encounterDetails/EncounterDetails';
import NotFound from '../notFound/NotFound';
import CreateEncounter from '../createEncounter/CreateEncounter';

/**
 * Skeleton of the App, contains Routing info.
 */
const App = () => (
  <Router>
    <Switch>
      <Route exact path="/patients" component={Patients} />
      <Route exact path="/patients/create" component={CreatePatients} />
      <Route exact path="/patients/:id" component={PatientDetails} />
      <Route exact path="/patients/:id/encounters/create" component={CreateEncounter} />
      <Route exact path="/patients/:id/encounters/:encounterId" component={EncounterDetails} />
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default App;
