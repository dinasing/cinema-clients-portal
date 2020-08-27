import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { AdditionalGoodsList } from './AdditionalGoodsList';

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
    const { movie_time_additional_goods_prices } = this.props.movieTime.movieTime;
    const { selectedAdditionalGoods } = this.state;

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
        <AdditionalGoodsList
          additionalGoods={additionalGoods}
          selectedAdditionalGoods={selectedAdditionalGoods}
          handleAddAdditionalGoodsToTicket={this.handleAddAdditionalGoodsToTicket}
          handleRemoveAdditionalGoodsFromTicket={this.handleRemoveAdditionalGoodsFromTicket}
        />
        <TotalCostContainer />
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
