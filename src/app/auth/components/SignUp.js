import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Container, Input, Label, FormGroup, Form, Alert } from 'reactstrap';
import { register } from '../actions/authAction';
import { clearErrors } from '../../common/actions/errorAction';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    };
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      this.setState({ message: error.id === 'REGISTER_FAIL' ? 'Login is already taken!' : null });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { firstName, lastName, email, password } = this.state;
    const newUser = { firstName, lastName, email, password };
    this.props.register(newUser);
  };

  render() {
    const { message } = this.state;

    return (
      <Container>
        {message ? <Alert color="danger">{message}</Alert> : null}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <h1>sign up</h1>
            <Label htmlFor="firstName">first name</Label>
            <Input
              className="mb-3"
              type="text"
              id="firstName"
              onChange={this.handleChange}
              placeholder=""
            />

            <Label htmlFor="lastName">last name</Label>
            <Input
              className="mb-3"
              type="text"
              id="lastName"
              onChange={this.handleChange}
              placeholder=""
            />

            <Label htmlFor="email">email</Label>
            <Input
              className="mb-3"
              type="email"
              id="email"
              onChange={this.handleChange}
              placeholder=""
            />

            <Label htmlFor="password">password</Label>
            <Input
              className="mb-3"
              type="password"
              id="password"
              onChange={this.handleChange}
              placeholder=""
            />

            <Button color="primary">sign up</Button>
          </FormGroup>
        </Form>
      </Container>
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
