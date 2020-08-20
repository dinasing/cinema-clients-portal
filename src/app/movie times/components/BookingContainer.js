import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Media, Col, Row, Button, Badge } from 'reactstrap';
import moment from 'moment';
import HallSchema from '../../cinema hall/components/HallSchema';
import { getMovieTimeById } from '../actions/movieTimeAction';
import { getSeatTypes } from '../../seat type/actions/seatTypeAction';

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
      <Button color="primary" disabled={!numberOfSeats}>
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
    };
  }

  async componentDidMount() {
    await this.props.getSeatTypes().then(() => {
      this.props.getMovieTimeById(this.props.match.params.session_id);
    });
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
      : [...selectedSeats, { row: rowIndex, seat: seatIndex, seatsType }];
    const newPrice = selectedSeats.some(
      selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
    )
      ? totalPrice - +seatPrice
      : totalPrice + +seatPrice;

    this.setState({ selectedSeats: newSeats, totalPrice: newPrice });
  };

  render() {
    const { selectedSeats, totalPrice } = this.state;
    const {
      cinema_hall,
      date,
      time,
      movie,
      cinema,
      movie_time_prices,
    } = this.props.movieTime.movieTime;

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
        <Row>
          <Col lg="auto">
            {cinema_hall && seatTypes ? (
              <HallSchema
                schema={cinema_hall.schema}
                hallTitle={cinema_hall.title}
                seatTypes={seatTypes}
                bookedSeats={bookedSeats}
                selectedSeats={selectedSeats}
                handleSelectSeat={this.handleSelectSeat}
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
            <BookSelectedSeatsButton numberOfSeats={selectedSeats.length} totalPrice={totalPrice} />
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
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
});

export default connect(mapStateToProps, { getMovieTimeById, getSeatTypes })(BookingContainer);
