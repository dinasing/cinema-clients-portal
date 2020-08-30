import {
  GET_CINEMAS,
  GET_CINEMA,
  GET_MOVIE_TIMES_FOR_CINEMA,
  CINEMAS_LOADING,
  MOVIE_TIMES_LOADING,
  CLEAN_CINEMAS,
} from '../../common/actions/types';

const initialState = {
  cinemas: [],
  cinema: {},
  movieTimes: [],
  loading: false,
  movieTimesLoading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CINEMAS:
      return {
        ...state,
        cinemas: action.payload,
        loading: false,
      };
    case GET_CINEMA:
      return {
        ...state,
        cinema: action.payload,
        loading: false,
      };
    case GET_MOVIE_TIMES_FOR_CINEMA:
      return {
        ...state,
        movieTimes: action.payload,
        movieTimesLoading: false,
      };
    case MOVIE_TIMES_LOADING:
      return { ...state, movieTimesLoading: true };
    case CLEAN_CINEMAS:
      return {
        ...state,
        cinemas: [],
        cinema: {},
        movieTimes: [],
        loading: false,
        movieTimesLoading: false,
      };
    case CINEMAS_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
}
