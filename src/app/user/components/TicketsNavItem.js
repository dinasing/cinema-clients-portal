import React from 'react';
import { NavLink } from 'reactstrap';

export const TicketsNavItem = props => {
  const { userId } = props;

  return (
    <>
      <NavLink href={`/users/${userId}/tickets`}>Tickets</NavLink>
    </>
  );
};
