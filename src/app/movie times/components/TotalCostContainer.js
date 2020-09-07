import React from 'react';
import { Container, Col, Row } from 'reactstrap';

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

export const sumTotalCost = (
  additionalGoods,
  movieTimePrices,
  selectedAdditionalGoods,
  seatsPreparedForBooking
) => {
  const seatsPrice = seatsPreparedForBooking.reduce(
    (price, seat) =>
      (price += movieTimePrices.find(
        movieTimePrice => movieTimePrice.seatTypeId === seat.seatTypeId
      ).price),
    0
  );

  const goodsPrice = selectedAdditionalGoods.reduce(
    (price, selectedGoods) =>
      (price +=
        selectedGoods.number * additionalGoods.find(goods => selectedGoods.id === goods.id).price),
    0
  );
  const totalPrice = goodsPrice + seatsPrice;

  return totalPrice;
};

const TotalCost = props => {
  const {
    additionalGoods,
    movieTimePrices,
    selectedAdditionalGoods,
    seatsPreparedForBooking,
  } = props;

  const totalPrice = sumTotalCost(
    additionalGoods,
    movieTimePrices,
    selectedAdditionalGoods,
    seatsPreparedForBooking
  );

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

export const TotalCostContainer = props => {
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
