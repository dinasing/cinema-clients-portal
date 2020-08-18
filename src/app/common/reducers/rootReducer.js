import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducer';
import movieReducer from '../../movie/reducers/movieReducer';
import movieTimeReducer from '../../movie times/reducers/movieTimeReducer';
import seatTypeReducer from '../../seat type/reducers/seatTypeReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
  movie: movieReducer,
  movieTime: movieTimeReducer,
  seatType: seatTypeReducer,
});

export default rootReducer;
