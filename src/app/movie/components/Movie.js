import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Media } from 'reactstrap';
import moment from 'moment';
import {
  getMovieById,
  getMovieTimes,
  getMovieGenres,
  setMoviesToInitialState,
} from '../actions/movieAction';
import MovieTimesList from '../../movie times/components/MovieTimesList';

class Movie extends Component {
  componentDidMount() {
    this.props.setMoviesToInitialState();
    this.props.getMovieById(this.props.match.params.movie_id);
    this.props.getMovieTimes(this.props.match.params.movie_id);
    this.props.getMovieGenres();
  }

  render() {
    const { movie, movieTimes, genres } = this.props.movies;
    const movieGenres =
      movie.genre && genres
        ? movie.genre.map(id => (genres[id] ? <i>{genres[id].name} </i> : null))
        : [];

    return (
      <Container>
        <h2>{movie.title}</h2>

        <Media>
          {' '}
          <img
            height="450px"
            self-align="center"
            src={movie.poster || 'https://kinoactive.ru/uploads/no-poster.jpg'}
            alt="poster"
          />{' '}
          <Container>
            <p>{movie.description}</p>
            {movieGenres ? <p> {movieGenres}</p> : null}

            <p>
              {moment(movie.release_date).format('DD.MM.YYYY') +
                ' - ' +
                moment(movie.end_date).format('DD.MM.YYYY')}
            </p>
          </Container>
        </Media>

        <br />
        {movieTimes.length ? (
          <>
            <br />
            <h5>Movie sessions </h5>
            <MovieTimesList movieTimes={movieTimes} />
          </>
        ) : this.props.movies.movieTimesLoading ? (
          'Loading ...'
        ) : (
          'There are no movie times for "' + movie.title + '" right now'
        )}
      </Container>
    );
  }
}

Movie.propTypes = {
  getMovieById: PropTypes.func.isRequired,
  getMovieTimes: PropTypes.func.isRequired,
  getMovieGenres: PropTypes.func.isRequired,
  setMoviesToInitialState: PropTypes.func.isRequired,
  movies: PropTypes.object,
};

const mapStateToProps = state => ({
  movies: state.rootReducer.movie,
});

export default connect(mapStateToProps, {
  getMovieById,
  getMovieTimes,
  getMovieGenres,
  setMoviesToInitialState,
})(Movie);
