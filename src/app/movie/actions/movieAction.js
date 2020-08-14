import axios from 'axios';
import {
  GET_MOVIES,
  MOVIES_LOADING,
  GET_MOVIE,
  GET_MOVIE_TIMES,
  CLEAN_MOVIES,
  MOVIE_TIMES_LOADING,
  GET_GENRES_FAIL,
  GET_GENRES,
} from '../../common/actions/types';
import { returnErrors, clearErrors } from '../../common/actions/errorAction';
import { tokenConfig } from '../../auth/actions/authAction';

const apiKey = '5886c0d8ba5d3a8a90ea37b8b1dc8ca1';

export const getMovies = () => dispatch => {
  dispatch(setMoviesLoading());
  axios.get('/movie/relevant').then(res =>
    dispatch({
      type: GET_MOVIES,
      payload: res.data,
    })
  );
};

export const getMovieById = id => dispatch => {
  dispatch(setMoviesLoading());
  axios.get('/movie/' + id).then(res =>
    dispatch({
      type: GET_MOVIE,
      payload: res.data,
    })
  );
};

export const getMovieTimes = id => dispatch => {
  dispatch(setMoviesToInitialState());
  dispatch(setMoviesTimesLoading());

  axios.get('/movie/' + id + '/relevant-movie-time/').then(res =>
    dispatch({
      type: GET_MOVIE_TIMES,
      payload: res.data,
    })
  );
};

export const getMovieGenres = () => dispatch => {
  axios
    .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
    .then(res => {
      dispatch({
        type: GET_GENRES,
        payload: res.data.genres,
      });
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'GET_GENRES_FAIL'));
      dispatch({
        type: GET_GENRES_FAIL,
      });
    });
};

export const setMoviesLoading = () => {
  return { type: MOVIES_LOADING };
};

export const setMoviesTimesLoading = () => {
  return { type: MOVIE_TIMES_LOADING };
};

export const setMoviesToInitialState = () => {
  return { type: CLEAN_MOVIES };
};
