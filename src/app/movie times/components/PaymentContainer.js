import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Container, Col, Row, Button, Alert } from 'reactstrap';
import { bookSeats } from '../actions/bookingAction';
import { TotalCostContainer, sumTotalCost } from './TotalCostContainer';
import StripeContainer from './StripeContainer';

const socket = io('http://localhost:3000');

class PaymentContainer extends Component {
  render() {
    const { seatsPreparedForBooking, additionalGoodsPreparedForPayment } = this.props.movieTime;
    const { seatTypes } = this.props.seatType;
    const {
      movie_time_additional_goods_prices,
      movie_time_prices,
    } = this.props.movieTime.movieTime;

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
        <TotalCostContainer
          additionalGoods={additionalGoods}
          movieTimePrices={movie_time_prices}
          movieTimeAdditionalGoodsPrices={movie_time_additional_goods_prices}
          selectedAdditionalGoods={additionalGoodsPreparedForPayment}
          seatsPreparedForBooking={seatsPreparedForBooking}
          seatTypes={seatTypes}
        />

        <StripeContainer price={price} />
      </>
    );
  }
}

PaymentContainer.propTypes = {
  movieTime: PropTypes.object.isRequired,
  seatType: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  bookSeats: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, { bookSeats })(PaymentContainer);
