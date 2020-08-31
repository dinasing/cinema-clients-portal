import React, { useState } from 'react';
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Logout from '../../auth/components/Logout';

const Example = props => {
  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const { user } = props;

  return (
    <ButtonDropdown direction="left" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle color="link" caret>
        {user.firstName} {user.lastName}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem divider />
        <DropdownItem>
          <Logout />
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default Example;
