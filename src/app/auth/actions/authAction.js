import axios from 'axios';
import { returnErrors } from '../../common/actions/errorAction';
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
} from '../../common/actions/types';

export const tokenConfig = () => {
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      'Content-type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const loadUser = () => (dispatch, getState) => {
  dispatch({ type: USER_LOADING });
  axios
    .get('/user/profile', tokenConfig())
    .then(response => {
      if (getState().rootReducer.auth.token)
        dispatch({
          type: USER_LOADED,
          payload: response.data,
        });
    })
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status, 'AUTH_FAIL'));
      dispatch({
        type: AUTH_ERROR,
      });
    });
};

export const logout = () => {
  return {
    type: LOGOUT_SUCCESS,
  };
};

export const register = ({ firstName, lastName, email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ firstName, lastName, email, password });

  axios
    .post('/auth/signup', body, config)
    .then(response =>
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response.data,
      })
    )
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status, 'REGISTER_FAIL'));
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

export const login = ({ email, password }) => dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  axios
    .post('/auth/login', body, config)
    .then(response =>
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      })
    )
    .catch(error => {
      dispatch(returnErrors(error.response.data, error.response.status, 'LOGIN_FAIL'));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};
