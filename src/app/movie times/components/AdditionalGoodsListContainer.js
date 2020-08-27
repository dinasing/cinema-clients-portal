import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Col, Row, Button, Alert } from 'reactstrap';
import { AdditionalGoodsList } from './AdditionalGoodsList';

const SelectedSeat = props => {
  const {
    seat: { row, seat, seatTypeId },
    seatTypes,
    prices,
  } = props;

  return (
    <>
      <h6>
        {' '}
        row {row + 1} / seat {seat + 1}
      </h6>
      <Row>
        <Col>{seatTypes.find(seatType => seatType.id === seatTypeId).title}</Col>

        <Col>
          <Container>{prices.find(price => price.seatTypeId === seatTypeId).price}$</Container>
        </Col>
      </Row>
    </>
  );
};

const SelectedAdditionalGood = props => {
  const {
    goods: { number, id },
    additionalGoods,
  } = props;
  const thisAdditionalGood = additionalGoods.find(goods => goods.id === id);

  return number ? (
    <>
      <Row>
        <Col>
          <h6>
            {thisAdditionalGood.title}
            {number > 1 ? ` x${number}` : null}
          </h6>
        </Col>
        <Col>
          <Container>{thisAdditionalGood.price * number}$</Container>
        </Col>
      </Row>
    </>
  ) : null;
};

const TotalCost = props => {
  const {
    additionalGoods,
    movieTimePrices,
    selectedAdditionalGoods,
    seatsPreparedForBooking,
  } = props;

  let seatsPrice = seatsPreparedForBooking.reduce(
    (price, seat) =>
      (price += movieTimePrices.find(
        movieTimePrice => movieTimePrice.seatTypeId === seat.seatTypeId
      ).price),
    0
  );

  let goodsPrice = selectedAdditionalGoods.reduce(
    (price, selectedGoods) =>
      (price +=
        selectedGoods.number * additionalGoods.find(goods => selectedGoods.id === goods.id).price),
    0
  );
  const totalPrice = goodsPrice + seatsPrice;

  return (
    <Row>
      <Col></Col>
      <Col>
        <Container>
          <h6>{totalPrice}$</h6>
        </Container>
      </Col>
    </Row>
  );
};

const TotalCostContainer = props => {
  const {
    selectedAdditionalGoods,
    seatsPreparedForBooking,
    movieTimePrices,
    seatTypes,
    additionalGoods,
  } = props;

  return (
    <>
      {seatsPreparedForBooking ? (
        <>
          <h5>cart</h5>
          {seatsPreparedForBooking.map(seat => (
            <SelectedSeat seat={seat} prices={movieTimePrices} seatTypes={seatTypes} />
          ))}
        </>
      ) : null}
      {selectedAdditionalGoods ? (
        <>
          {selectedAdditionalGoods.map(goods => (
            <SelectedAdditionalGood additionalGoods={additionalGoods} goods={goods} />
          ))}
        </>
      ) : null}
      <TotalCost
        additionalGoods={additionalGoods}
        movieTimePrices={movieTimePrices}
        selectedAdditionalGoods={selectedAdditionalGoods}
        seatsPreparedForBooking={seatsPreparedForBooking}
      />
    </>
  );
};

class AdditionalGoodsListContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAdditionalGoods: [],
    };
  }

  componentDidMount() {
    const { movie_time_additional_goods_prices } = this.props.movieTime.movieTime;
    this.setState({
      selectedAdditionalGoods: movie_time_additional_goods_prices.map(price => ({
        id: price.additionalGoodId,
        number: 0,
      })),
    });
  }

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
      movie_time_additional_goods_prices,
      movie_time_prices,
    } = this.props.movieTime.movieTime;
    const { seatsPreparedForBooking } = this.props.movieTime;
    const { selectedAdditionalGoods } = this.state;
    const { seatTypes } = this.props.seatType;

    const additionalGoods = movie_time_additional_goods_prices
      ? movie_time_additional_goods_prices.map(price => ({
          id: price.additionalGoodId,
          price: price.price,
          title: price.additional_good.title,
          image: price.additional_good.image,
          description: price.additional_good.description,
        }))
      : [];

    return (
      <>
        <h4>add snack to your ticket</h4>
        <Row>
          <Col>
            <AdditionalGoodsList
              additionalGoods={additionalGoods}
              selectedAdditionalGoods={selectedAdditionalGoods}
              handleAddAdditionalGoodsToTicket={this.handleAddAdditionalGoodsToTicket}
              handleRemoveAdditionalGoodsFromTicket={this.handleRemoveAdditionalGoodsFromTicket}
            />
          </Col>
          <Col>
            <TotalCostContainer
              additionalGoods={additionalGoods}
              movieTimePrices={movie_time_prices}
              movieTimeAdditionalGoodsPrices={movie_time_additional_goods_prices}
              selectedAdditionalGoods={selectedAdditionalGoods}
              seatsPreparedForBooking={seatsPreparedForBooking}
              seatTypes={seatTypes}
            />
          </Col>
        </Row>
      </>
    );
  }
}

AdditionalGoodsListContainer.propTypes = {
  movieTime: PropTypes.object.isRequired,
  seatType: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, {})(AdditionalGoodsListContainer);
