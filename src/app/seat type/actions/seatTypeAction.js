import axios from 'axios';
import {
  GET_SEAT_TYPES,
  GET_SEAT_TYPE,
  SEAT_TYPE_LOADING,
  GET_SEAT_TYPE_FAIL,
} from '../../common/actions/types';
import { returnErrors } from '../../common/actions/errorAction';

export const getSeatTypes = () => async dispatch => {
  dispatch(setSeatTypeLoading());
  axios
    .get('/seat-type')
    .then(res =>
      dispatch({
        type: GET_SEAT_TYPES,
        payload: res.data,
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'GET_SEAT_TYPE_FAIL'));
      dispatch({
        type: GET_SEAT_TYPE_FAIL,
      });
    });
};

export const getSeatTypeById = id => dispatch => {
  dispatch(setSeatTypeLoading());
  axios
    .get('/seat-type/' + id)
    .then(res =>
      dispatch({
        type: GET_SEAT_TYPE,
        payload: res.data,
      })
    )
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'GET_SEAT_TYPE_FAIL'));
      dispatch({
        type: GET_SEAT_TYPE_FAIL,
      });
    });
};

export const setSeatTypeLoading = () => {
  return { type: SEAT_TYPE_LOADING };
};
