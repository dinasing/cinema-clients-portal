import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import { Col, Row, Alert, Button } from 'reactstrap';
import { prepareGoodsForPayment } from '../actions/bookingAction';
import { AdditionalGoodsList } from './AdditionalGoodsList';
import { TotalCostContainer } from './TotalCostContainer';

const socket = io('http://localhost:3000');

const BookSeatsButton = props => {
  const { id } = props;
  return (
    <Link to={`/session/${id}/payment`}>
      <Button color="primary" onClick={props.prepareGoods} size="lg" block>
        Buy
      </Button>
    </Link>
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

  componentWillUnmount() {
    socket.close();
  }

  prepareGoods = async () => {
    const { selectedAdditionalGoods } = this.state;
    await this.props.prepareGoodsForPayment(selectedAdditionalGoods);
  };

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
      id,
    } = this.props.movieTime.movieTime;

    const { seatsPreparedForBooking, seatsBookedByUser } = this.props.movieTime;
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

            <BookSeatsButton
              selectedAdditionalGoods={selectedAdditionalGoods}
              prepareGoods={this.prepareGoods}
              id={id}
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
  prepareGoodsForPayment: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  movieTime: state.rootReducer.movieTime,
  seatType: state.rootReducer.seatType,
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, { prepareGoodsForPayment })(AdditionalGoodsListContainer);
