import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { store } from '../../store';
import { ProtectedRoute } from './ProtectedRoute';
import Login from '../../auth/components/Login';
import SignUp from '../../auth/components/SignUp';
import Movies from '../../movie/components/MovieList';
import Movie from '../../movie/components/Movie';
import BookingContainer from '../../movie times/components/BookingContainer';
import AdditionalGoodsListContainer from '../../movie times/components/AdditionalGoodsListContainer';
import PaymentContainer from '../../movie times/components/PaymentContainer';

class Routes extends Component {
  render() {
    const { isAuthenticated } = this.props.auth;
    const { seatsPreparedForBooking } = this.props.movieTime;

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

        <Route exact path="/session/:movie_time_id" component={BookingContainer} store={store} />

        <ProtectedRoute
          exact
          path="/session/:movie_time_id/payment"
          component={PaymentContainer}
          store={store}
        />

        <Route
          exact
          path="/additional-goods"
          render={() =>
            isAuthenticated && seatsPreparedForBooking.length ? (
              <AdditionalGoodsListContainer />
            ) : (
              <Redirect to="/movies" />
            )
          }
          store={store}
        />

        <Route path="*" component={() => '404 NOT FOUND'} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
  movieTime: state.rootReducer.movieTime,
});

export default connect(mapStateToProps, null)(Routes);
