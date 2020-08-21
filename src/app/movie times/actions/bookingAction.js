import axios from 'axios';
import {
  GET_BOOKED_SEATS,
  BOOK_SEATS,
  BOOK_SEATS_FAIL,
  CLEAN_SEATS_BOOKED_BY_USER,
} from '../../common/actions/types';
import { returnErrors } from '../../common/actions/errorAction';
import { tokenConfig } from '../../auth/actions/authAction';

export const getBookedSeats = id => async dispatch => {
  await axios
    .get(`/ticket/${id}`)
    .then(response =>
      dispatch({
        type: GET_BOOKED_SEATS,
        payload: response.data,
      })
    )
    .catch(error => {
      if (error.response) dispatch(returnErrors(error.response.data, error.response.status));
    });
};

export const bookSeats = transaction => async (dispatch, getState) => {
  await axios
    .post('/booking', transaction, tokenConfig(getState))
    .then(() => {
      dispatch({
        type: BOOK_SEATS,
        payload: transaction.selectedSeats,
      });
    })
    .catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data, err.response.status, 'BOOK_SEATS_FAIL'));
      }
      dispatch({
        type: BOOK_SEATS_FAIL,
      });
    });
};

export const cleanSeatsBookedByUser = () => dispatch => {
  dispatch(cleanSeatsBookedByUserEvent());
};

const cleanSeatsBookedByUserEvent = () => {
  return { type: CLEAN_SEATS_BOOKED_BY_USER };
};
