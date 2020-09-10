import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';

const stripeKey = process.env.STRIPE_PK;

export default class StripeContainer extends Component {
  render() {
    return (
      <>
        <StripeCheckout stripeKey={stripeKey} token={this.props.handleToken} />
      </>
    );
  }
}
