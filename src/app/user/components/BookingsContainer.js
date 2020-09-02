import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getBookings } from '../../user/actions/userAction';
import BookingsList from './BookingsList';

export class BookingContainer extends Component {
  componentDidMount() {
    this.props.getBookings(this.props.match.params.id);
  }

  render() {
    const { bookings, loading } = this.props.user;

    return (
      <>
        <h3>Your tickets</h3>
        {loading ? 'Loading ...' : <BookingsList bookings={bookings} />}
      </>
    );
  }
}

BookingContainer.propTypes = {
  getBookings: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.rootReducer.user,
});

export default connect(mapStateToProps, { getBookings })(BookingContainer);
