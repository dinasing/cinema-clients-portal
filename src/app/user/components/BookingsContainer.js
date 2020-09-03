import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { getBookings } from '../../user/actions/userAction';
import BookingsList from './BookingsList';

export class BookingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'future',
    };
  }

  componentDidMount() {
    this.props.getBookings(this.props.match.params.id);
  }

  handleFilterChange = e => {
    this.setState({ filter: e.target.value });
  };

  filterBookings(bookings, filter) {
    const currentTime = new Date().getTime();
    const currentDate = new Date().setHours(0, 0, 0, 0);

    switch (filter) {
      case 'all':
        return bookings;
      case 'future':
        return bookings.filter(
          booking =>
            new Date(booking.movie_time.date) > currentDate ||
            (new Date(booking.movie_time.date) === currentDate &&
              new Date().setUTCHours(
                booking.movie_time.time.slice(0, 2),
                booking.movie_time.time.slice(3, 5)
              ) >= currentTime)
        );
      case 'past':
        return bookings.filter(
          booking =>
            new Date(booking.movie_time.date) < currentDate ||
            (new Date(booking.movie_time.date) === currentDate &&
              new Date().setUTCHours(
                booking.movie_time.time.slice(0, 2),
                booking.movie_time.time.slice(3, 5)
              ) < currentTime)
        );
      default:
        return [];
    }
  }

  sortByDate(array) {
    return array.sort((a, b) =>
      new Date(a.movie_time.date) > new Date(b.movie_time.date) ? 1 : -1
    );
  }

  render() {
    const { bookings, loading } = this.props.user;
    const { filter } = this.state;

    const filteredBookings = bookings.length
      ? this.filterBookings(this.sortByDate(bookings), filter)
      : [];

    return (
      <>
        <h3>Your tickets </h3>
        <Input type="select" onChange={this.handleFilterChange}>
          <option value="future" defaultValue>
            future
          </option>
          <option value="past">past</option>
          <option value="all">all</option>
        </Input>
        {loading ? 'Loading ...' : <BookingsList bookings={filteredBookings} />}
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
