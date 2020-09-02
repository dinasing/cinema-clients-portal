import React, { Component } from 'react';
import { Card, CardText, CardTitle, CardBody, Badge, Row, Col, Table, Container } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';

const BookingsList = props => {
  const { bookings } = props;

  return (
    <>
      {bookings.length ? (
        bookings.map(booking => <Booking booking={booking} />)
      ) : (
        <p>
          You did not book tickets yet. Go to
          <Link to="/movies">Movies</Link> to find out what is in the box office right now.
        </p>
      )}
    </>
  );
};

const Booking = props => {
  const {
    booking: { movie_time, tickets, purchased_additional_goods },
  } = props;

  const totalPrice = tickets.reduce(
    (sum, ticket) =>
      (sum += movie_time.movie_time_prices.find(price => price.seatTypeId === ticket.seatTypeId)
        .price),
    0
  );
  const goodsPrice = purchased_additional_goods.length
    ? purchased_additional_goods.reduce(
        (sum, goods) =>
          (sum +=
            movie_time.movie_time_additional_goods_prices.find(
              price => price.additionalGoodId === goods.additionalGoodId
            ).price * goods.number),
        0
      )
    : 0;

  return (
    <>
      <Card>
        <Row>
          <Col>
            <Container>
              <br />
              <h4>{movie_time.movie.title}</h4>
              <h4>{movie_time.cinema.title}</h4>
              <p>Hall "{movie_time.cinema_hall.title}"</p>
              <p>
                {movie_time.time.slice(0, -3)} {moment(movie_time.date).format('DD.MM.YYYY')}
              </p>
            </Container>
          </Col>
          <Col>
            <Table>
              <tr>
                <th>row</th>
                <th>seat</th>
                <th>seat's type</th>
                <th>price</th>
              </tr>
              {tickets.map(ticket => (
                <Ticket
                  ticket={ticket}
                  price={
                    movie_time.movie_time_prices.find(
                      price => price.seatTypeId === ticket.seatTypeId
                    ).price
                  }
                />
              ))}{' '}
              {purchased_additional_goods.length ? (
                <>
                  <tr>
                    <th>snack</th>
                    <th>amount</th>
                    <th></th>
                    <th>price</th>
                  </tr>
                  {purchased_additional_goods.map(goods => (
                    <AdditionalGoods
                      goods={goods}
                      price={
                        movie_time.movie_time_additional_goods_prices.find(
                          price => price.additionalGoodId === goods.additionalGoodId
                        ).price
                      }
                    />
                  ))}
                </>
              ) : null}
              <th>total price</th>
              <th></th>
              <th></th>
              <th>{totalPrice + goodsPrice}$</th>
            </Table>
          </Col>
        </Row>
      </Card>
      <br />
    </>
  );
};

const Ticket = props => {
  const {
    ticket: { row, seat, seat_type },
    price,
  } = props;

  return (
    <tr>
      <td>{row + 1}</td>
      <td>{seat + 1}</td>
      <td>{seat_type.title}</td>
      <td>{price}$</td>
    </tr>
  );
};

const AdditionalGoods = props => {
  const {
    goods: { number, additional_good },
    price,
  } = props;

  return (
    <tr>
      <td>{additional_good.title}</td>
      <td>x{number}</td>
      <td></td>
      <td>{price * number}$</td>
    </tr>
  );
};

export default BookingsList;
