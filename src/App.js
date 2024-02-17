import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <PrivateRoute exact path="/" component={HomePage} />
          <Route path="/login" component={Login} />
          {/* Add more routes as needed */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
