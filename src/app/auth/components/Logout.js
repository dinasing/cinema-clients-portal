import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { logout } from '../actions/authAction';

export class Logout extends Component {
  render() {
    return (
      <>
        <NavItem onClick={this.props.logout} href="#">
          Sign out
        </NavItem>
      </>
    );
  }
}

Logout.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default connect(null, { logout })(Logout);
