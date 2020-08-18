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
    ? cinemas.map(cinema => <CinemasMovieTimes date={date} cinema={cinema} />)
    : movies
    ? movies.map(movie => <MovieMovieTimes date={date} movie={movie} />)
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
  const date = new Date(props.date).setHours(0, 0, 0, 0);
  const currentTime = new Date().getTime();

  const timesBadges = sortByTime([...movieTimes]).map(movieTime => {
    const time = new Date().setUTCHours(movieTime.time.slice(0, 2), movieTime.time.slice(3, 5));
    return date === new Date().setHours(0, 0, 0, 0) ? (
      <>
        {' '}
        {currentTime <= time ? (
          <Link to={`/session/${movieTime.id}`}>
            <Badge color="" id={`movieTime${movieTime.id}`}>
              {' '}
              {movieTime.time.slice(0, -3)}
            </Badge>
          </Link>
        ) : (
          <Badge id={`movieTime${movieTime.id}`}> {movieTime.time.slice(0, -3)}</Badge>
        )}
        {currentTime <= time ? (
          <UncontrolledTooltip placement="right" target={`movieTime${movieTime.id}`}>
            {`price: ${sortByPrice([...movieTime.prices])[0].price} $`}
          </UncontrolledTooltip>
        ) : null}
      </>
    ) : (
      <>
        {' '}
        <Link to={`/session/${movieTime.id}`}>
          <Badge color="" id={`movieTime${movieTime.id}`}>
            {' '}
            {movieTime.time.slice(0, -3)}
          </Badge>
        </Link>{' '}
        <UncontrolledTooltip placement="right" target={`movieTime${movieTime.id}`}>
          {`price: ${sortByPrice([...movieTime.prices])[0].price} $`}
        </UncontrolledTooltip>
      </>
    );
  });

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

  const date = new Date(props.date).setHours(0, 0, 0, 0);
  const currentTime = new Date().getTime();

  const timesBadges = sortByTime([...movieTimes]).map(movieTime => {
    const time = new Date().setUTCHours(movieTime.time.slice(0, 2), movieTime.time.slice(3, 5));
    return date === new Date().setHours(0, 0, 0, 0) ? (
      <>
        {' '}
        {currentTime <= time ? (
          <Link to={`/session/${movieTime.id}`}>
            <Badge color="" id={`movieTime${movieTime.id}`}>
              {' '}
              {movieTime.time.slice(0, -3)}
            </Badge>
          </Link>
        ) : (
          <Badge id={`movieTime${movieTime.id}`}> {movieTime.time.slice(0, -3)}</Badge>
        )}
        {currentTime <= time ? (
          <UncontrolledTooltip placement="right" target={`movieTime${movieTime.id}`}>
            {`Buy ticket (from ${sortByPrice([...movieTime.prices])[0].price}$)`}
          </UncontrolledTooltip>
        ) : null}
      </>
    ) : (
      <>
        {' '}
        <Link to={`/session/${movieTime.id}`}>
          <Badge color="" id={`movieTime${movieTime.id}`}>
            {' '}
            {movieTime.time.slice(0, -3)}
          </Badge>
        </Link>{' '}
        <UncontrolledTooltip placement="right" target={`movieTime${movieTime.id}`}>
          {`price: ${sortByPrice([...movieTime.prices])[0].price} $`}
        </UncontrolledTooltip>
      </>
    );
  });

  return (
    <Row>
      <Col>
        <Link to={`/movie-theaters/${cinemaId}`}>{title}</Link>
      </Col>
      <Col>{timesBadges}</Col>
    </Row>
  );
};

export default MovieTimesList;
