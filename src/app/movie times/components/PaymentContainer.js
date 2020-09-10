import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Alert } from 'reactstrap';
import { intentPayment } from '../actions/bookingAction';
import { TotalCostContainer, sumTotalCost } from './TotalCostContainer';
import StripeContainer from './StripeContainer';
import { clearErrors } from '../../common/actions/errorAction';

const socket = io('http://localhost:3000');

class PaymentContainer extends Component {
  state = { message: null };

  componentDidMount() {
    this.props.clearErrors();
  }

  handleToken = async token => {
    const {
      seatsPreparedForBooking,
      movieTime: { id },
      additionalGoodsPreparedForPayment,
    } = this.props.movieTime;
    const userId = this.props.auth.user.id;

    await this.props
      .intentPayment({
        seatsPreparedForBooking,
        movieTimeId: id,
        userId,
        additionalGoods: additionalGoodsPreparedForPayment,
        token,
      })
      .then(() => {
        seatsPreparedForBooking.forEach(seat => {
          socket.emit('delete-seat-from-booked', {
            row: seat.row,
            seat: seat.seat,
            userId,
            movieTimeId: id,
          });
        });
      });
  };

  onDismissSuccessAlert = () => {
    const { id } = this.props.movieTime.movieTime;
    window.location.href = `/session/${id}`;
  };

  onDismissErrorAlert = () => {
    this.props.clearErrors();
  };

  render() {
    const {
      seatsPreparedForBooking,
      additionalGoodsPreparedForPayment,
      seatsBookedByUser,
    } = this.props.movieTime;
    const { seatTypes } = this.props.seatType;
    const {
      movie_time_additional_goods_prices,
      movie_time_prices,
    } = this.props.movieTime.movieTime;
    const { message } = this.props.error;

    const additionalGoods = movie_time_additional_goods_prices
      ? movie_time_additional_goods_prices.map(price => ({
          id: price.additionalGoodId,
          price: price.price,
          title: price.additional_good.title,
          image: price.additional_good.image,
          description: price.additional_good.description,
        }))
      : [];

    const price = sumTotalCost(
      additionalGoods,
      movie_time_prices,
      additionalGoodsPreparedForPayment,
      seatsPreparedForBooking
    );

    return (
      <>
        <Alert isOpen={message} toggle={this.onDismissErrorAlert} color="danger">
          {message}
        </Alert>
        <Alert
          isOpen={seatsBookedByUser.length && !message}
          toggle={this.onDismissSuccessAlert}
          color="success"
        >
          Booking successfully completed!
        </Alert>
        <TotalCostContainer
          additionalGoods={additionalGoods}
          movieTimePrices={movie_time_prices}
          movieTimeAdditionalGoodsPrices={movie_time_additional_goods_prices}
          selectedAdditionalGoods={additionalGoodsPreparedForPayment}
          seatsPreparedForBooking={seatsPreparedForBooking}
          seatTypes={seatTypes}
        />

        <StripeContainer price={price} handleToken={this.handleToken} />
      </>
    );
  }
}

PaymentContainer.propTypes = {
  movieTime: PropTypes.object.isRequired,
  seatType: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  intentPayment: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
  auth: state.rootReducer.auth,
  error: state.rootReducer.error,
});

export default connect(mapStateToProps, { intentPayment, clearErrors })(PaymentContainer);
