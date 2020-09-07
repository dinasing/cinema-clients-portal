import axios from 'axios';
import {
  GET_BOOKED_SEATS,
  BOOK_SEATS,
  BOOK_SEATS_FAIL,
  CLEAN_SEATS_BOOKED_BY_USER,
  GET_GOODS,
  PREPARE_SEATS_FOR_BOOKING,
  REMOVE_SEATS_PREPARED_FOR_BOOKING,
  PREPARE_GOODS,
  CLEAN_PREPARED_GOODS,
  INTENT_PAYMENT,
  INTENT_PAYMENT_FAIL,
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
        payload: transaction.seatsPreparedForBooking,
      });
    })
    .catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data, err.response.status, 'BOOK_SEATS_FAIL'));
        dispatch({
          type: BOOK_SEATS_FAIL,
        });
      }
    });
};

export const intentPayment = transaction => async (dispatch, getState) => {
  await axios
    .post('/payment', transaction, tokenConfig(getState))
    .then(response => {
      dispatch({
        type: INTENT_PAYMENT,
        payload: response,
      });
    })
    .catch(err => {
      if (err.response) {
        dispatch(returnErrors(err.response.data, err.response.status, 'INTENT_PAYMENT_FAIL'));
        dispatch({
          type: INTENT_PAYMENT_FAIL,
        });
      }
    });
};

const removePreparedSeats = () => {
  return { type: REMOVE_SEATS_PREPARED_FOR_BOOKING };
};

export const prepareSeatsForBooking = seats => async dispatch => {
  setTimeout(() => {
    dispatch(removePreparedSeats());
  }, 300000);
  await dispatch({
    type: PREPARE_SEATS_FOR_BOOKING,
    payload: seats,
  });
};

export const prepareGoodsForPayment = goods => async dispatch => {
  await dispatch({
    type: PREPARE_GOODS,
    payload: goods,
  });
};

export const cleanSeatsBookedByUser = () => dispatch => {
  dispatch(cleanSeatsBookedByUserEvent());
  dispatch(cleanPreparedGoodsEvent());
};

const cleanSeatsBookedByUserEvent = () => {
  return { type: CLEAN_SEATS_BOOKED_BY_USER };
};

const cleanPreparedGoodsEvent = () => {
  return { type: CLEAN_PREPARED_GOODS };
};

export const getAdditionalGoods = cinemaId => async dispatch => {
  await axios.get(`/additional-goods/${cinemaId}`).then(res =>
    dispatch({
      type: GET_GOODS,
      payload: res.data,
    })
  );
};
