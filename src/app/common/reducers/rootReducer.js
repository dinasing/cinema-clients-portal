import { combineReducers } from 'redux';
import authReducer from '../../auth/reducers/authReducer';
import errorReducer from './errorReducer';
import movieReducer from '../../movie/reducers/movieReducer';
import userReducer from '../../user/reducers/userReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  error: errorReducer,
  movie: movieReducer,
  user: userReducer,
});

export default rootReducer;
