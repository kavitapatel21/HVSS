import "../../assets/scss/header.scss" 
import React, { useContext } from "react";
import ProfilePhoto from "../../assets/images/user.svg";
import NavbarToggle from "../../assets/images/nav-toggle.svg"
import { Dropdown } from "react-bootstrap";
import {useAuth} from '../../context/AuthProvider';

const Header = () => {
  const { auth } = useAuth();
  return (
    <div className="hvss-header d-flex align-items-center justify-content-between justify-content-lg-end">   
      <img src={NavbarToggle} width={18} height={18} className="d-block d-lg-none" alt="Toggle" />
      <Dropdown>
          <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
              <img src={ProfilePhoto} width={24} height={24} className="me-3" alt="Profile" /> {auth.username}
          </Dropdown.Toggle>
          <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Logout</Dropdown.Item> 
          </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default Header;