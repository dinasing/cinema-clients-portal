import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCinemas } from '../actions/cinemaAction';
import { Card, CardImg, CardBody, CardTitle, Col, Row, CardText } from 'reactstrap';

export class MovieTheaters extends Component {
  componentDidMount() {
    this.props.getCinemas();
  }
  render() {
    const { cinemas } = this.props.cinemas;

    return (
      <>
        <h2>Movie theaters</h2>
        {this.props.cinemas.loading ? (
          <p>Loading cinemas ...</p>
        ) : (
          cinemas.map(cinema => {
            return (
              <Card key={cinema.id}>
                <Row xs="4">
                  <Col>
                    <CardImg
                      src={
                        cinema.photo
                          ? cinema.photo
                          : 'https://i.pinimg.com/originals/8a/eb/d8/8aebd875fbddd22bf3971c3a7159bdc7.png'
                      }
                    />
                  </Col>
                  <Col>
                    <CardBody>
                      <CardTitle>
                        <Link to={'/movie-theaters/' + cinema.id}>{cinema.title}</Link>
                      </CardTitle>
                      <CardText>{cinema.city}</CardText>
                      <CardText>{cinema.address}</CardText>
                    </CardBody>
                  </Col>
                </Row>
              </Card>
            );
          })
        )}
      </>
    );
  }
}

MovieTheaters.propTypes = {
  getCinemas: PropTypes.func.isRequired,
  cinemas: PropTypes.object,
};

const mapStateToProps = state => ({
  cinemas: state.rootReducer.cinema,
});

export default connect(mapStateToProps, { getCinemas })(MovieTheaters);
