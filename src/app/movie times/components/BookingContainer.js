import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Media, Col, Row, Button, Badge, Alert } from 'reactstrap';
import moment from 'moment';
import HallSchema from './HallSchema';
import { getMovieTimeById } from '../actions/movieTimeAction';
import { getSeatTypes } from '../../seat type/actions/seatTypeAction';
import { getBookedSeats, bookSeats, cleanSeatsBookedByUser } from '../actions/bookingAction';

const MovieTimeInfoHeader = props => {
  const { date, time, movie, cinema } = props.movieTimeInfo;

  return date && time && movie && cinema ? (
    <>
      <Media>
        <img
          width="150px"
          self-align="center"
          src={movie.poster || 'https://kinoactive.ru/uploads/no-poster.jpg'}
          alt="poster"
        />
        <Container>
          <h2>{movie.title}</h2>
          <p>{cinema.title}</p>
          <p>{`${time.slice(0, -3)} ${moment(date).format('DD.MM.YYYY')}`}</p>
        </Container>
      </Media>
    </>
  ) : null;
};

const SeatTypes = props => {
  const { seatTypes, movie_time_prices, schema } = props;
  const hallsSeatTypes = Array.from(new Set(schema.map(row => +row.seatsType)));

  return (
    <>
      {seatTypes
        .filter(seatType => hallsSeatTypes.includes(seatType.id))
        .map(seatType => (
          <>
            <h5>{seatType.title}</h5>
            <p>
              {' '}
              <Button key={seatType.id} color="primary">
                <Badge color="primary">
                  {seatType.numberOfPeople === 1 ? 1 : <Container>1</Container>}
                </Badge>
              </Button>{' '}
              {movie_time_prices.find(price => price.seatTypeId === seatType.id).price}$ for{' '}
              {seatType.numberOfPeople === 1 ? '1 person' : `${seatType.numberOfPeople} persons`}
            </p>
          </>
        ))}
    </>
  );
};

const BookSelectedSeatsButton = props => {
  const { numberOfSeats, totalPrice } = props;
  return (
    <>
      <p>
        {numberOfSeats
          ? numberOfSeats > 1
            ? `${numberOfSeats} seats selected`
            : `1 seat selected`
          : null}
      </p>
      {numberOfSeats ? <p>total price: {totalPrice}$</p> : null}
      <Button color="primary" disabled={!numberOfSeats} onClick={props.handleSubmitSeatsForBooking}>
        {numberOfSeats ? 'Book seats' : 'Select seats'}
      </Button>
    </>
  );
};

class BookingContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSeats: [],
      totalPrice: 0,
      message: null,
    };
  }

  async componentDidMount() {
    const { movie_time_id } = this.props.match.params;
    await this.props.getSeatTypes();
    await this.props.getBookedSeats(movie_time_id);
    this.props.getMovieTimeById(movie_time_id);
  }

  handleSelectSeat = (rowIndex, seatIndex, seatsType) => () => {
    const { selectedSeats, totalPrice } = this.state;
    const { movie_time_prices } = this.props.movieTime.movieTime;
    const seatPrice = movie_time_prices.find(price => price.seatTypeId === seatsType).price;

    const newSeats = selectedSeats.some(
      selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
    )
      ? selectedSeats.filter(
          selectedSeat => !(selectedSeat.row === rowIndex && selectedSeat.seat === seatIndex)
        )
      : [...selectedSeats, { row: rowIndex, seat: seatIndex, seatTypeId: seatsType }];
    const newPrice = selectedSeats.some(
      selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
    )
      ? totalPrice - +seatPrice
      : totalPrice + +seatPrice;

    this.setState({ selectedSeats: newSeats, totalPrice: newPrice });
  };

  handleSubmitSeatsForBooking = async () => {
    const { selectedSeats } = this.state;
    const movieTimeId = this.props.match.params.movie_time_id;
    const userId = this.props.auth.user.id;

    await this.props.bookSeats({ selectedSeats, movieTimeId, userId });
    this.setState({ selectedSeats: [], totalPrice: 0 });
  };

  onDismissSuccessAlert = () => {
    this.props.cleanSeatsBookedByUser();
  };

  onDismissErrorAlert = () => {
    this.setState({ message: null });
  };

  render() {
    const { selectedSeats, totalPrice, message } = this.state;
    const {
      cinema_hall,
      date,
      time,
      movie,
      cinema,
      movie_time_prices,
    } = this.props.movieTime.movieTime;
    const { bookedSeats, seatsBookedByUser } = this.props.movieTime;
    const { seatTypes } = this.props.seatType;
    const movieTimeInfo = {
      date,
      time,
      movie,
      cinema,
    };

    return (
      <>
        {movieTimeInfo ? <MovieTimeInfoHeader movieTimeInfo={movieTimeInfo} /> : null}
        <Alert isOpen={message} toggle={this.onDismissErrorAlert} color="danger">
          {message}
        </Alert>

        <Alert
          isOpen={seatsBookedByUser.length && !message}
          toggle={this.onDismissSuccessAlert}
          color="success"
        >
          Seats(s) were booked successfully!
        </Alert>

        <Row>
          <Col lg="auto">
            {cinema_hall && seatTypes && bookedSeats ? (
              <HallSchema
                schema={cinema_hall.schema}
                hallTitle={cinema_hall.title}
                seatTypes={seatTypes}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                handleSelectSeat={this.handleSelectSeat}
                seatsBookedByUser={seatsBookedByUser}
              />
            ) : null}
          </Col>
          <Col>
            {cinema_hall && seatTypes && movie_time_prices ? (
              <SeatTypes
                schema={cinema_hall.schema}
                movie_time_prices={movie_time_prices}
                seatTypes={seatTypes}
              />
            ) : null}
            <BookSelectedSeatsButton
              handleSubmitSeatsForBooking={this.handleSubmitSeatsForBooking}
              numberOfSeats={selectedSeats.length}
              totalPrice={totalPrice}
            />
          </Col>
        </Row>
      </>
    );
  }
}

BookingContainer.propTypes = {
  movieTime: PropTypes.object.isRequired,
  seatType: PropTypes.object.isRequired,
  getMovieTimeById: PropTypes.func.isRequired,
  getSeatTypes: PropTypes.func.isRequired,
  getBookedSeats: PropTypes.func.isRequired,
  bookSeats: PropTypes.func.isRequired,
  cleanSeatsBookedByUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, {
  getMovieTimeById,
  getSeatTypes,
  getBookedSeats,
  bookSeats,
  cleanSeatsBookedByUser,
})(BookingContainer);
