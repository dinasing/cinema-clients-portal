import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Input, Label, FormGroup, Form, Alert } from 'reactstrap';
import { register } from '../actions/authAction';
import { clearErrors } from '../../common/actions/errorAction';
import SignUpForm from './SignUpForm';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: null,
    };
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      this.setState({ message: error.id === 'REGISTER_FAIL' ? 'Login is already taken!' : null });
    }
  }

  handleSubmit = newUser => {
    this.props.register(newUser);
  };

  render() {
    const { message } = this.state;

    return (
      <>
        {message ? <Alert color="danger">{message}</Alert> : null}
        <h1>sign up</h1>
        <SignUpForm handleSubmit={this.handleSubmit} handleChange={this.handleChange} />
      </>
    );
  }
}

SignUp.propTypes = {
  error: PropTypes.object.isRequired,
  register: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.rootReducer.isAuthenticated,
  error: state.rootReducer.error,
});

export default connect(mapStateToProps, { register, clearErrors })(SignUp);
