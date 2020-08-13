import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardText, CardBody, CardTitle, Container, Row } from 'reactstrap';
import moment from 'moment';
import { getMovies, getMovieGenres } from '../actions/movieAction';

export const MovieCard = props => {
  const { poster, id, title, release_date, end_date } = props.movie;

  return (
    <Card>
      <CardImg src={poster || 'https://kinoactive.ru/uploads/no-poster.jpg'} />
      <CardBody>
        <CardTitle>
          <Link to={'/movies/' + id}> {title}</Link>
        </CardTitle>
        <CardText>
          {moment(release_date).format('DD.MM.YYYY') +
            ' - ' +
            moment(end_date).format('DD.MM.YYYY')}
        </CardText>
      </CardBody>
    </Card>
  );
};

export class MovieList extends Component {
  componentDidMount() {
    this.props.getMovies();
    this.props.getMovieGenres();
  }

  movieList(CardComponent) {
    const { movies } = this.props.movies;
    return movies.map(movie => {
      return <CardComponent movie={movie} key={movie.id} />;
    });
  }

  render() {
    return (
      <>
        <h2>Movies </h2>
        {this.props.movies.loading ? (
          <p>Loading movies ...</p>
        ) : this.props.movies.movies.length ? (
          <Container>
            <Row lg="3" sm="2" xs="1">
              {this.movieList(MovieCard)}
            </Row>
          </Container>
        ) : (
          <p>There are no movies at the box office right now.</p>
        )}
      </>
    );
  }
}

MovieList.propTypes = {
  getMovies: PropTypes.func.isRequired,
  getMovieGenres: PropTypes.func.isRequired,
  movies: PropTypes.object,
};
const mapStateToProps = state => ({
  movies: state.rootReducer.movie,
});

export default connect(mapStateToProps, { getMovies, getMovieGenres })(MovieList);
