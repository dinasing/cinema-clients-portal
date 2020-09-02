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

  return (
    <>
      <Card>
        <Row>
          <Col>
            <Container>
              {' '}
              <CardTitle>
                <h4>{movie_time.movie.title}</h4>
              </CardTitle>
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
              ))}
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
      <td>{price}</td>
    </tr>
  );
};

export default BookingsList;
