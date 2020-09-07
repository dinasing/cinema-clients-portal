import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';

export default class StripeContainer extends Component {
  handleToken(token) {}

  render() {
    const { price } = this.props;

    return (
      <>
        <StripeCheckout
          stripeKey="pk_test_51HOKfzJOOxdaIeuK6Mis6CuDddH4A4kPwau7gV8FiCgRLG3xiiTneXTAWBlNw5H6CrmmjOkAnI5OBORKxOcKKzSR00TCLPOI29"
          token={this.handleToken}
          amount={price * 100}
        />
      </>
    );
  }
}
