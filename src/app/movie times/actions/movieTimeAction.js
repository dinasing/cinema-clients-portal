import axios from 'axios';
import {
  GET_MOVIE_TIMES,
  GET_MOVIE_TIME,
  MOVIE_TIME_LOADING,
  GET_MOVIES_FOR_MOVIE_TIMES,
  GET_CINEMA_HALLS_FOR_MOVIE_TIMES,
  GET_CINEMAS_FOR_MOVIE_TIMES,
  GET_SEATS_TYPES_FOR_MOVIE_TIMES,
} from '../../common/actions/types';
import { returnErrors } from '../../common/actions/errorAction';

export const getMovieTimes = () => dispatch => {
  dispatch(setMovieTimeLoading());
  axios
    .get('/movie-time')
    .then(response =>
      dispatch({
        type: GET_MOVIE_TIMES,
        payload: response.data,
      })
    )
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      }
    });
};

export const getMovies = () => dispatch => {
  axios
    .get('/movie/for-movie-times')
    .then(response =>
      dispatch({
        type: GET_MOVIES_FOR_MOVIE_TIMES,
        payload: response.data,
      })
    )
    .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const getCinemas = () => dispatch => {
  axios
    .get('/cinema')
    .then(response => {
      dispatch({
        type: GET_CINEMAS_FOR_MOVIE_TIMES,
        payload: response.data,
      });
    })
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      } else {
        dispatch(returnErrors(error.message));
      }
    });
};

export const getCinemaHalls = () => dispatch => {
  axios
    .get('/cinema-hall')
    .then(response => {
      dispatch({
        type: GET_CINEMA_HALLS_FOR_MOVIE_TIMES,
        payload: response.data,
      });
    })
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      } else {
        dispatch(returnErrors(error.message));
      }
    });
};

export const getCinemaHallsForCinema = cinemaId => dispatch => {
  axios
    .get(`/cinema-hall/cinema/${cinemaId}`)
    .then(response => {
      dispatch({
        type: GET_CINEMA_HALLS_FOR_MOVIE_TIMES,
        payload: response.data,
      });
    })
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      } else {
        dispatch(returnErrors(error.message));
      }
    });
};

export const getSeatsTypes = () => dispatch => {
  axios
    .get('/seat-type')
    .then(response => {
      dispatch({
        type: GET_SEATS_TYPES_FOR_MOVIE_TIMES,
        payload: response.data,
      });
    })
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      } else {
        dispatch(returnErrors(error.message));
      }
    });
};

export const getMovieTimesForCinema = id => dispatch => {
  axios
    .get(`/movie-time/cinema/${id}`)
    .then(response => {
      dispatch({
        type: GET_MOVIE_TIMES,
        payload: response.data,
      });
    })
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      } else {
        dispatch(returnErrors(error.message));
      }
    });
};

export const getMoviesForCinema = id => dispatch => {
  axios
    .get(`/movie/cinema/${id}`)
    .then(response => {
      dispatch({
        type: GET_MOVIES_FOR_MOVIE_TIMES,
        payload: response.data,
      });
    })
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      } else {
        dispatch(returnErrors(error.message));
      }
    });
};

export const getMovieTimeById = id => dispatch => {
  dispatch(setMovieTimeLoading());
  axios
    .get('/movie-time/' + id)
    .then(response =>
      dispatch({
        type: GET_MOVIE_TIME,
        payload: response.data,
      })
    )
    .catch(error => dispatch(returnErrors(error.response.data, error.response.status)));
};

export const setMovieTimeLoading = () => {
  return { type: MOVIE_TIME_LOADING };
};
