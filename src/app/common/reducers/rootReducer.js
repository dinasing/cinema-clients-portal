import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducer';
import movieReducer from '../../movie/reducers/movieReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
  movie: movieReducer,
});

export default rootReducer;
