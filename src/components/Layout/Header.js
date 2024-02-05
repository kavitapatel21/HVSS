import "../../assets/scss/header.scss" 
import React, { useContext } from "react";
import { Dropdown } from "react-bootstrap";
import {useAuth} from '../../context/AuthProvider';

const Header = () => {
  const { auth } = useAuth();
  console.log(auth)
  return (
    <div className="hvss-header text-end">    
      <Dropdown>
          <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
              {auth.username}
          </Dropdown.Toggle>
          <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Logout</Dropdown.Item> 
          </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};
export default Header;