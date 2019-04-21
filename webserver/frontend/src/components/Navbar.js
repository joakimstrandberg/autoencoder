import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import "../style/Navbar.css";

const Navbar = () => (
    <div>
        <Nav>
            <NavItem>
            <NavLink tag={Link}  activeClassName="active" style={{ textDecoration: 'none' }} to="/mnist">
              mnist
            </NavLink>
            </NavItem>
          <NavItem>
            <NavLink tag={Link}  activeClassName="active" style={{ textDecoration: 'none' }} to="/faces">
              Celebrity faces dataset
            </NavLink>
          </NavItem>
        </Nav>
    </div>
)

export default Navbar;