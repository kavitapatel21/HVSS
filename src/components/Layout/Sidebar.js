import "../../assets/scss/sidebar.scss"
import { Link } from "react-router-dom";
import Search from "../../assets/images/search.svg";
import Export from "../../assets/images/Export.svg";
import Subcodes from "../../assets/images/code.svg";
import CloseSidebar from "../../assets/images/close.svg";

const Sidebar = () => {
    return (
      <div className="side-menu"> 
        <div className="text-end px-3 mb-5 d-block d-lg-none">
          <img src={CloseSidebar} className="ms-auto" width={32} height={32} alt="Close-sidebar" />
        </div>  
        <Link className="logo text-white">
            <h4 className="primary-title px-2">HVSS</h4>
        </Link>
        <div className="hvss-menu">
            <Link to="/" className="logo text-white d-flex align-items-center jusfify-content-start active">
                <img src={Search} className="me-4" alt="Sidebar" />
                <span>Search</span>
            </Link>
            <Link to="/import" className="logo text-white d-flex align-items-center jusfify-content-start">
                <img src={Export} className="me-4" alt="Sidebar" />
                <span>Import</span>
            </Link>            
            <Link to="/subcodes" className="logo text-white d-flex align-items-center jusfify-content-start">
                <img src={Subcodes} width={18} height={18} className="me-4" alt="Sidebar" />
                <span>Subcodes</span>
            </Link>
        </div>
      </div>
    );
  };
export default Sidebar;