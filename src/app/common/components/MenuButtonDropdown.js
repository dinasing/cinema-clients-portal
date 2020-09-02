import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Logout from '../../auth/components/Logout';
import { TicketsNavItem } from '../../user/components/TicketsNavItem';

const Example = props => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const { user } = props;

  return (
    <ButtonDropdown direction="left" isOpen={dropdownOpen} toggle={toggle} nav inNavbar>
      <DropdownToggle nav color="link" caret>
        {user.firstName} {user.lastName}
      </DropdownToggle>
      <DropdownMenu>
        {' '}
        <DropdownItem>
          <TicketsNavItem userId={user.id} />
        </DropdownItem>
        <DropdownItem divider />
        <DropdownItem>
          <Logout />
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default Example;
