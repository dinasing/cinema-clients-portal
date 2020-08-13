import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, NavbarBrand, Nav, NavItem, Container } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { loadUser } from '../../auth/actions/authAction';

const GuestLinks = () => {
  return (
    <>
      <NavItem>
        <Link to="/signup">Sign Up</Link>
      </NavItem>
      <NavItem className="ml-2">
        <Link outline to="/login">
          Sign In
        </Link>
      </NavItem>
    </>
  );
};

class AppNavbar extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    return (
      <Navbar color="light" light expand="sm" className="mb-5">
        <Container>
          <NavbarBrand href="/">Cinema</NavbarBrand>
          <Nav className="mr-auto " navbar>
            <NavItem>
              <Link to="/movies">Movies</Link>
            </NavItem>
            <NavItem className="ml-2">
              <Link to="/movie-theaters">Movie theaters</Link>
            </NavItem>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

AppNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.rootReducer.auth,
});

export default connect(mapStateToProps, { loadUser })(withRouter(AppNavbar));
