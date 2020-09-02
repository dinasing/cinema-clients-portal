import { GET_USERS_BOOKINGS, SET_USERS_BOOKINGS_LOADING } from '../../common/actions/types';

const initialState = {
  bookings: [],
  loading: false,
  msg: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USERS_BOOKINGS:
      return { ...state, bookings: action.payload, loading: false };
    case SET_USERS_BOOKINGS_LOADING: {
      return { ...state, loading: true };
    }
    default:
      return state;
  }
}
