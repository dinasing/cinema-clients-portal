import axios from 'axios';
import {
  GET_CINEMAS,
  GET_CINEMA,
  GET_MOVIE_TIMES_FOR_CINEMA,
  CINEMAS_LOADING,
  MOVIE_TIMES_LOADING,
  CLEAN_CINEMAS,
} from '../../common/actions/types';

export const getCinemas = () => dispatch => {
  dispatch(setCinemasLoading());
  axios.get('/cinema').then(res =>
    dispatch({
      type: GET_CINEMAS,
      payload: res.data,
    })
  );
};

export const getCinemaById = id => async dispatch => {
  dispatch(setCinemasLoading());
  await axios.get('/cinema/' + id).then(res =>
    dispatch({
      type: GET_CINEMA,
      payload: res.data,
    })
  );
};

export const getMovieTimes = id => dispatch => {
  dispatch(setMoviesTimesLoading());
  axios.get('/cinema/' + id + '/relevant-movie-time/').then(res =>
    dispatch({
      type: GET_MOVIE_TIMES_FOR_CINEMA,
      payload: res.data,
    })
  );
};

export const setMoviesTimesLoading = () => {
  return { type: MOVIE_TIMES_LOADING };
};
export const setCinemasToInitialState = () => {
  return { type: CLEAN_CINEMAS };
};

export const setCinemasLoading = () => {
  return { type: CINEMAS_LOADING };
};
