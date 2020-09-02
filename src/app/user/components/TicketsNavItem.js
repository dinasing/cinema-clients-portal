import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
export const TicketsNavItem = props => {
  const { userId } = props;

  return (
    <NavItem>
      <Link to={`/users/${userId}/tickets`}>Tickets</Link>
    </NavItem>
  );
};
