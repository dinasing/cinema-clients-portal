import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from '../../auth/components/Login';
import SignUp from '../../auth/components/SignUp';

class Routes extends Component {
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <Switch>
        <Route
          path="/login"
          render={() => (isAuthenticated ? <Redirect to="/movies" /> : <Login />)}
        />
        <Route
          path="/signup"
          render={() => (isAuthenticated ? <Redirect to="/movies" /> : <SignUp />)}
        />

        <Route path="*" component={() => '404 NOT FOUND'} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, null)(Routes);
