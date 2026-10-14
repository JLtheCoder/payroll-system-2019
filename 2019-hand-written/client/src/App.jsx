import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Nav, NavLink } from 'reactstrap';
import PayrollUpload from './components/PayrollUpload';
import Report from './components/Report';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Nav>
          <NavLink tag={Link} to="/">Payroll Upload</NavLink>
          <NavLink tag={Link} to="/report">Payroll Report</NavLink>
        </Nav>
        <div className="main">
          <Switch>
            <Route exact path="/" component={PayrollUpload} />
            <Route path="/report" component={Report} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
