import {
  GET_MOVIES,
  GET_MOVIE,
  GET_MOVIE_TIMES,
  MOVIES_LOADING,
  MOVIE_TIMES_LOADING,
  GET_GENRES_FAIL,
  GET_GENRES,
  CLEAN_MOVIES,
} from '../../common/actions/types';

const initialState = {
  movies: [],
  movie: {},
  movieTimes: [],
  loading: false,
  movieTimesLoading: false,
  genres: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MOVIES:
      return {
        ...state,
        movies: action.payload,
        loading: false,
      };
    case GET_MOVIE:
      return {
        ...state,
        movie: action.payload,
        loading: false,
      };
    case GET_MOVIE_TIMES:
      return {
        ...state,
        movieTimes: action.payload,
        movieTimesLoading: false,
      };
    case MOVIE_TIMES_LOADING:
      return { ...state, movieTimesLoading: true };
    case MOVIES_LOADING:
      return { ...state, loading: true };
    case GET_GENRES:
      return {
        ...state,
        genres: action.payload,
      };
    case CLEAN_MOVIES:
      return { ...initialState };
    case GET_GENRES_FAIL:
    default:
      return state;
  }
}
