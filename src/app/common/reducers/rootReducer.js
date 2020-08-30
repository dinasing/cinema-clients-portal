import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducer';
import movieReducer from '../../movie/reducers/movieReducer';
import cinemaReducer from '../../cinema/reducers/cinemaReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
  movie: movieReducer,
  cinema: cinemaReducer,
});

export default rootReducer;
