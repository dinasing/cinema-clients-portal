import axios from 'axios';
import { GET_USERS_BOOKINGS, SET_USERS_BOOKINGS_LOADING } from '../../common/actions/types';
import { returnErrors } from '../../common/actions/errorAction';
import { tokenConfig } from '../../auth/actions/authAction';

export const setLoading = () => {
  return { type: SET_USERS_BOOKINGS_LOADING };
};

export const getBookings = userId => dispatch => {
  dispatch(setLoading());
  axios
    .get(`/booking/user/${userId}`)
    .then(response =>
      dispatch({
        type: GET_USERS_BOOKINGS,
        payload: response.data,
      })
    )
    .catch(error => {
      if (error.response) {
        dispatch(returnErrors(error.response.data, error.response.status));
      }
    });
};
