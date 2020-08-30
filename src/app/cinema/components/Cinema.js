import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCinemaById, getMovieTimes } from '../actions/cinemaAction';
import MovieTimesList from '../../movie times/components/MovieTimesList';

class MovieTheater extends Component {
  async componentDidMount() {
    const cinemaId = this.props.match.params.id;
    await this.props.getCinemaById(cinemaId);
    this.props.getMovieTimes(cinemaId);
  }

  render() {
    const { cinema, movieTimes } = this.props.cinemas;

    return (
      <>
        <h2>{cinema.title}</h2>
        <small>{cinema.description}</small>
        <p>
          {cinema.city}, {cinema.address}
        </p>
        <h5>Movie sessions</h5>
        {movieTimes.length ? (
          <MovieTimesList movieTimes={movieTimes} />
        ) : this.props.cinemas.movieTimesLoading ? (
          'Loading ...'
        ) : (
          'There are no movie times for the "' + cinema.title + '" right now.'
        )}
      </>
    );
  }
}

MovieTheater.propTypes = {
  getCinemaById: PropTypes.func.isRequired,
  getMovieTimes: PropTypes.func.isRequired,
  cinemas: PropTypes.object,
};

const mapStateToProps = state => ({
  cinemas: state.rootReducer.cinema,
});

export default connect(mapStateToProps, {
  getCinemaById,
  getMovieTimes,
})(MovieTheater);
