import React, { Component } from 'react';
import { Card, CardText, CardBody, Badge, Row, Col, UncontrolledTooltip } from 'reactstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';

class MovieTimesList extends Component {
  render() {
    const { movieTimes } = this.props;

    const MovieTimesCards = movieTimes.map(movieTime => (
      <MovieTimeCard movieTime={movieTime} component={CinemasMovieTimes} />
    ));

    return (
      <div>
        <br />
        {MovieTimesCards}
      </div>
    );
  }
}

const MovieTimeCard = props => {
  const { date, cinemas, movies } = props.movieTime;
  const MovieTimes = cinemas
    ? cinemas.map(cinema => <CinemasMovieTimes cinema={cinema} />)
    : movies
      ? movies.map(movie => <MovieMovieTimes movie={movie} />)
      : null;

  return (
    <>
      <Card>
        <CardBody>
          <Row>
            <Col>
              <CardText>{moment(date).format('DD.MM.YYYY')}</CardText>
            </Col>
            <Col>{MovieTimes}</Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

function sortByTime(array) {
  return array.sort((a, b) => (a.time > b.time ? 1 : -1));
}

function sortByPrice(array) {
  return array.sort((a, b) => (a.price > b.price ? 1 : -1));
}

const CinemasMovieTimes = props => {
  const { movieTimes, title, cinemaId } = props.cinema;

  const timesBadges = sortByTime([...movieTimes]).map(movieTime => (
    <>
      {' '}
      <Badge id={`movieTime${movieTime.id}`}> {movieTime.time.slice(0, -3)}</Badge>
      <UncontrolledTooltip placement="right" target={`movieTime${movieTime.id}`}>
        {sortByPrice([...movieTime.prices])[0].price}
      </UncontrolledTooltip>
    </>
  ));

  return (
    <Row>
      <Col>
        <Link to={`/movie-theaters/${cinemaId}`}>{title}</Link>
      </Col>
      <Col>{timesBadges}</Col>
    </Row>
  );
};

const MovieMovieTimes = props => {
  const { movieTimes, title, movieId } = props.movie;

  const timesBadges = sortByTime([...movieTimes]).map(movieTime => (
    <>
      {' '}
      <Badge id={`movieTime${movieTime.id}`}> {movieTime.time.slice(0, -3)}</Badge>
      <UncontrolledTooltip placement="right" target={`movieTime${movieTime.id}`}>
        {sortByPrice([...movieTime.prices])[0].price}
      </UncontrolledTooltip>
    </>
  ));

  return (
    <Row>
      <Col>
        <Link to={`/movies/${movieId}`}>{title}</Link>
      </Col>
      <Col>{timesBadges}</Col>
    </Row>
  );
};

export default MovieTimesList;
