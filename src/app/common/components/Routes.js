import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { store } from '../../store';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../../auth/components/Login';
import SignUp from '../../auth/components/SignUp';
import Movies from '../../movie/components/MovieList';
import Movie from '../../movie/components/Movie';

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
        <Route exact path="/movies" component={Movies} store={store} />
        <Route exact path="/movies/:movie_id" component={Movie} store={store} />

        <ProtectedRoute exact path="/user/:id/tickets" component={Movie} store={store} />

        <Route path="*" component={() => '404 NOT FOUND'} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, null)(Routes);
