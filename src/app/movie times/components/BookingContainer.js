import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Media, Col, Row, Button, Badge, Alert, Modal } from 'reactstrap';
import io from 'socket.io-client';

import moment from 'moment';
import HallSchema from './HallSchema';
import { getMovieTimeById } from '../actions/movieTimeAction';
import { getSeatTypes } from '../../seat type/actions/seatTypeAction';
import { getBookedSeats, bookSeats, cleanSeatsBookedByUser } from '../actions/bookingAction';
import Login from '../../auth/components/Login';
import { AdditionalGoodsList } from './AdditionalGoodsList';

const socket = io('http://localhost:3000');

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
  const { numberOfSeats, seatsPrice } = props;
  return (
    <>
      <p>
        {numberOfSeats
          ? numberOfSeats > 1
            ? `${numberOfSeats} seats selected`
            : `1 seat selected`
          : null}
      </p>
      {numberOfSeats ? <p>total price: {seatsPrice}$</p> : null}
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
      seatsPrice: 0,
      message: null,
      showLoginModal: false,
      selectedAdditionalGoods: [],
      totalPrice: 0,
    };

    const { movie_time_id } = this.props.match.params;
    socket.emit('get-seats', movie_time_id);
    socket.on('booked-seats', bookedSeats => {
      this.setState({ seatsToBookByOthers: bookedSeats });
    });
  }

  async componentDidMount() {
    const { movie_time_id } = this.props.match.params;
    await this.props.getSeatTypes();
    await this.props.getBookedSeats(movie_time_id);
    await this.props.getMovieTimeById(movie_time_id).then(() => {
      const { movie_time_additional_goods_prices } = this.props.movieTime.movieTime;
      this.setState({
        selectedAdditionalGoods: movie_time_additional_goods_prices.map(price => ({
          id: price.additionalGoodId,
          number: 0,
        })),
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.auth.isAuthenticated && this.props.auth.isAuthenticated) {
      this.setState({ showLoginModal: false });
    }
  }

  handleSelectSeat = (rowIndex, seatIndex, seatsType) => () => {
    const { isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      const { selectedSeats, seatsPrice } = this.state;
      const { movie_time_prices } = this.props.movieTime.movieTime;

      const movieTimeId = this.props.match.params.movie_time_id;
      const userId = 'this.props.auth.user.id';

      const seatPrice = movie_time_prices.find(price => price.seatTypeId === seatsType).price;
      let newSeats = [];

      if (
        selectedSeats.some(
          selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
        )
      ) {
        newSeats = selectedSeats.filter(
          selectedSeat => !(selectedSeat.row === rowIndex && selectedSeat.seat === seatIndex)
        );
        socket.emit('delete-seat-from-booked', {
          row: rowIndex,
          seat: seatIndex,
          userId,
          movieTimeId,
        });
      } else {
        newSeats = [...selectedSeats, { row: rowIndex, seat: seatIndex, seatTypeId: seatsType }];
        socket.emit('book-seat', { row: rowIndex, seat: seatIndex, userId, movieTimeId });
      }

      const newPrice = selectedSeats.some(
        selectedSeat => selectedSeat.row == rowIndex && selectedSeat.seat == seatIndex
      )
        ? seatsPrice - +seatPrice
        : seatsPrice + +seatPrice;

      this.setState({ selectedSeats: newSeats, seatsPrice: newPrice });
    } else {
      this.showLoginModal();
    }
  };

  showLoginModal = () => {
    this.setState({ showLoginModal: true });
  };

  handleSubmitSeatsForBooking = async () => {
    const { selectedSeats } = this.state;
    const movieTimeId = this.props.match.params.movie_time_id;
    const userId = this.props.auth.user.id;

    await this.props.bookSeats({ selectedSeats, movieTimeId, userId });
    this.setState({ selectedSeats: [], seatsPrice: 0 });
  };

  onDismissSuccessAlert = () => {
    this.props.cleanSeatsBookedByUser();
  };

  onDismissErrorAlert = () => {
    this.setState({ message: null });
  };

  handleAddAdditionalGoodsToTicket = id => () => {
    const { selectedAdditionalGoods } = this.state;
    const newAdditionalGoods = selectedAdditionalGoods.find(goods => goods.id == id);
    newAdditionalGoods.number += 1;
    this.setState({
      selectedAdditionalGoods: [
        ...selectedAdditionalGoods.filter(goods => goods.id !== id),
        newAdditionalGoods,
      ],
    });
  };

  handleRemoveAdditionalGoodsFromTicket = id => () => {
    const { selectedAdditionalGoods } = this.state;
    const newAdditionalGoods = selectedAdditionalGoods.find(goods => goods.id === id);
    newAdditionalGoods.number = newAdditionalGoods.number ? newAdditionalGoods.number - 1 : 0;
    this.setState({
      selectedAdditionalGoods: [
        ...selectedAdditionalGoods.filter(goods => goods.id !== id),
        newAdditionalGoods,
      ],
    });
  };

  render() {
    const {
      selectedSeats,
      totalPrice,
      seatsPrice,
      message,
      selectedAdditionalGoods,
      seatsToBookByOthers,
      showLoginModal,
    } = this.state;
    const {
      cinema_hall,
      date,
      time,
      movie,
      cinema,
      movie_time_prices,
      movie_time_additional_goods_prices,
    } = this.props.movieTime.movieTime;
    const { bookedSeats, seatsBookedByUser } = this.props.movieTime;

    const additionalGoods = movie_time_additional_goods_prices
      ? movie_time_additional_goods_prices.map(price => ({
          id: price.additionalGoodId,
          price: price.price,
          title: price.additional_good.title,
          image: price.additional_good.image,
          description: price.additional_good.description,
        }))
      : [];
    const { seatTypes } = this.props.seatType;
    const movieTimeInfo = {
      date,
      time,
      movie,
      cinema,
    };

    return (
      <>
        <Modal isOpen={showLoginModal}>
          <Login />
        </Modal>
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
                bookedSeats={bookedSeats.concat(seatsToBookByOthers)}
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
              seatsPrice={seatsPrice}
            />
          </Col>
        </Row>
        {additionalGoods ? (
          <AdditionalGoodsList
            additionalGoods={additionalGoods}
            selectedAdditionalGoods={selectedAdditionalGoods}
            handleAddAdditionalGoodsToTicket={this.handleAddAdditionalGoodsToTicket}
            handleRemoveAdditionalGoodsFromTicket={this.handleRemoveAdditionalGoodsFromTicket}
          />
        ) : null}
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
