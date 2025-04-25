import "../../assets/scss/sidebar.scss"
import { Link } from "react-router-dom";
import Search from "../../assets/images/search.svg";
import Export from "../../assets/images/Export.svg";
import Subcodes from "../../assets/images/code.svg";
import CloseSidebar from "../../assets/images/close.svg";
import Settings from "../../assets/images/settings.svg";
import Products from "../../assets/images/products.svg";
import Results from "../../assets/images/results.svg";
import Scraping from "../../assets/images/scraper.svg";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    return (
      <div className="side-menu"> 
        <div className="text-end px-3 mb-5 d-block d-lg-none">
          <img src={CloseSidebar} className="ms-auto" width={32} height={32} alt="Close-sidebar" />
        </div>  
        <NavLink className="logo text-white">
            <h4 className="primary-title px-2">HVSS</h4>
        </NavLink>
        <div className="hvss-menu">
            <NavLink to="/home" activeClassName="active" className="logo text-white d-flex align-items-center jusfify-content-start">
                <img src={Search} className="me-4" alt="Sidebar" />
                <span>Search</span>
            </NavLink>
            <NavLink to="/import" activeClassName="active" className="logo text-white d-flex align-items-center jusfify-content-start">
                <img src={Export} className="me-4" alt="Sidebar" />
                <span>Import</span>
            </NavLink>            
            <NavLink to="/subcodes" activeClassName="active" className="logo text-white d-flex align-items-center jusfify-content-start">
                <img src={Subcodes} width={18} height={18} className="me-4" alt="Sidebar" />
                <span>Subcodes</span>
            </NavLink>
            {authUser && authUser.user.role == 'admin' && (
            <>
            <NavLink to="/users" activeClassName="active" className="logo text-white d-flex align-items-center jusfify-content-start">
                <img src={Search} width={18} height={18} className="me-4" alt="Sidebar" />
                <span>Users</span>
            </NavLink>

            <NavLink to="/vendors" activeClassName="active" className="logo text-white d-flex align-items-center jusfify-content-start">
            <img src={Search} width={18} height={18} className="me-4" alt="Sidebar" />
            <span>Vendors</span>
            </NavLink>
            </>
            )}
            <NavLink to="#" className="logo text-white flex-wrap d-flex align-items-center jusfify-content-start">
                <img src={Scraping} width={22} height={22} className="me-4" alt="Sidebar" />
                <span>Scraping</span>
                <ul className="submenu">
                  <li>
                    <NavLink to="/results" activeClassName="active" className="submenu-item">
                      <img src={Results} width={22} height={22} className="me-2" alt="Sidebar" /> Results
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/upload-products" activeClassName="active" className="submenu-item">
                      <img src={Products} width={22} height={22} className="me-2" alt="Sidebar" />Upload Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/settings" activeClassName="active" className="submenu-item">
                      <img src={Settings} width={22} height={22} className="me-2" alt="Sidebar" />Settings
                    </NavLink>
                  </li>
                </ul>
            </NavLink>
        </div>
      </div>
    );
  };
export default Sidebar;