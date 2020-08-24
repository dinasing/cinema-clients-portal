import {
  GET_MOVIE_TIMES,
  GET_MOVIE_TIME,
  GET_BOOKED_SEATS,
  BOOK_SEATS,
  BOOK_SEATS_FAIL,
  CLEAN_SEATS_BOOKED_BY_USER,
  GET_GOODS,
} from '../../common/actions/types';

const initialState = {
  movieTimes: [],
  movieTime: {},
  loading: false,
  bookedSeats: [],
  message: null,
  seatsBookedByUser: [],
  additionalGoods: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_MOVIE_TIMES:
      return {
        ...state,
        movieTimes: action.payload,
        loading: false,
      };
    case GET_MOVIE_TIME:
      return {
        ...state,
        movieTime: action.payload,
        loading: false,
      };
    case GET_BOOKED_SEATS:
      return {
        ...state,
        bookedSeats: action.payload,
      };
    case BOOK_SEATS:
      return {
        ...state,
        seatsBookedByUser: action.payload,
        bookedSeats: state.bookedSeats.concat(action.payload),
      };
    case BOOK_SEATS_FAIL:
      return { ...state, message: 'Seats have not been booked. Please, try again.' };
    case CLEAN_SEATS_BOOKED_BY_USER:
      return {
        ...state,
        seatsBookedByUser: [],
      };
    case GET_GOODS:
      return {
        ...state,
        additionalGoods: [].concat(action.payload),
      };
    default:
      return state;
  }
}
