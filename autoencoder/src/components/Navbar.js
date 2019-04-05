import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';

const Navbar = () => (
    <div>
        <Nav>
          <NavItem>
            <NavLink href="#">MNIST</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="#">Faces dataset</NavLink>
          </NavItem>
        </Nav>
    </div>
)

export default Navbar;