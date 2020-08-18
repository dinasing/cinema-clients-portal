import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container, Media } from 'reactstrap';
import moment from 'moment';
import HallSchema from '../../cinema hall/components/HallSchema';
import { getMovieTimeById } from '../actions/movieTimeAction';
import { getSeatTypes } from '../../seat type/actions/seatTypeAction';

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

class BookingContainer extends Component {
  async componentDidMount() {
    await this.props.getSeatTypes().then(() => {
      this.props.getMovieTimeById(this.props.match.params.session_id);
    });
  }

  render() {
    const {
      cinema_hall,
      date,
      time,
      movie,
      cinema,
      movie_time_prices,
    } = this.props.movieTime.movieTime;

    const { seatTypes } = this.props.seatType;
    const movieTimeInfo = {
      date,
      time,
      movie,
      cinema,
    };

    return (
      <>
        {movieTimeInfo ? <MovieTimeInfoHeader movieTimeInfo={movieTimeInfo} /> : null}
        <Container>
          {cinema_hall && seatTypes ? (
            <HallSchema
              schema={cinema_hall.schema}
              hallTitle={cinema_hall.title}
              seatTypes={seatTypes}
            />
          ) : null}
        </Container>
      </>
    );
  }
}

BookingContainer.propTypes = {
  movieTime: PropTypes.object.isRequired,
  seatType: PropTypes.object.isRequired,
  getMovieTimeById: PropTypes.func.isRequired,
  getSeatTypes: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
});

export default connect(mapStateToProps, { getMovieTimeById, getSeatTypes })(BookingContainer);
