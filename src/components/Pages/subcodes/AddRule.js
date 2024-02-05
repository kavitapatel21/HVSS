import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import DownArrow from "../../../assets/images/down_arrow.svg"
import BackArrow from "../../../assets/images/back.svg"
import Addrule from "../../../assets/images/add-rule.svg";

import "../../../assets/scss/subcodes.scss"
const AddRules = () => {
    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
              <a href="/subcodes" className="back mb-3 d-block">
                <img src={BackArrow} width={16} height={16} alt="Back" />
                <span className="regular-title">Back</span>
              </a>
                <h2 className="page-title mb-4">New Rule</h2> 
                <hr className="top-divider"/>
                <div className="rule-list mt-4">
                  <div className="d-md-flex align-items-center new-rule mb-3 flex-wrap">
                    <span className="rule-no me-0 me-md-3 mb-3">1</span> 
                    <div className="select-rules me-0 me-md-3 mb-3">
                      <div className="position-relative c-pointer">
                        <img src={DownArrow} className="ico_float right" alt="Down" />
                        <select name="select-rues" id="select_rules">
                          <option disabled>Select</option>
                          <option>Compatible</option>
                          <option>Incompatible</option>
                        </select>
                      </div>
                    </div>
                    <div className="regular-title me-0 me-md-3 mb-3">
                      When code at position
                    </div>
                    <div className="confition-input me-0 me-md-3 mb-3">
                      <input type="text" name="add-contiion" id="add_condition" placeholder="0" />
                    </div>
                    <div className="select-rules me-0 me-md-3 mb-3">
                      <div className="position-relative c-pointer">
                        <img src={DownArrow} className="ico_float right" alt="Down" />
                        <select name="select-rues" id="select_rules">
                          <option disabled>Select</option>
                          <option>In</option>
                          <option>Not In</option>
                          <option>Equals</option>
                          <option>No Equals</option>
                        </select>
                      </div>
                    </div>
                    <div className="set-conition mb-3">
                      <input type="text" name="set-contiion" id="set_condition" placeholder="MT" />
                    </div>
                  </div>
                </div>
                <div className="new-addition mt-4">
                    <a href="" className="new-record d-flex align-items-center">
                        <img src={Addrule} width={18} height={18} className="me-3" alt="Add Rule" />
                        Add new record
                    </a>
                </div>
            </div>
        </div>
      </div>
    );
  };
export default AddRules;