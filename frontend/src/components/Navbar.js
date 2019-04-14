import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

const Navbar = () => (
    <div>
        <Nav>
            <NavItem>
            <NavLink tag={Link} style={{ textDecoration: 'none' }} to="/mnist">
              mnist
            </NavLink>
            </NavItem>
          <NavItem>
            <NavLink tag={Link} style={{ textDecoration: 'none' }} to="/faces">
              Celebrity faces dataset
            </NavLink>
          </NavItem>
        </Nav>
    </div>
)

export default Navbar;