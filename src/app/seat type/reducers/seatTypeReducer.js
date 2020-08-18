import { GET_SEAT_TYPES, GET_SEAT_TYPE, GET_SEAT_TYPE_FAIL } from '../../common/actions/types';

const initialState = {
  seatTypes: [],
  seatType: {},
  loading: false,
  cinemasLoading: false,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SEAT_TYPES:
      return {
        ...state,
        seatTypes: action.payload,
        loading: false,
      };
    case GET_SEAT_TYPE:
      return {
        ...state,
        seatType: action.payload,
        loading: false,
      };
    case GET_SEAT_TYPE_FAIL:
    default:
      return state;
  }
}
