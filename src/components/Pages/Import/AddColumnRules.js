import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import DownArrow from "../../../assets/images/down_arrow.svg"
import BackArrow from "../../../assets/images/back.svg"
import Addrule from "../../../assets/images/add-rule.svg"; 
import "../../../assets/scss/import.scss"

const AddColumnRules = () => {
    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
                <a href="/import" className="back mb-3 d-block">
                    <img src={BackArrow} width={16} height={16} alt="Back" />
                    <span className="regular-title">Back</span>
                </a> 
                <h2 className="page-title mb-4">Column Rules</h2> 
                <hr className="top-divider"/> 
                <div className="column-wrapper">
                    <div className="column-list">
                        <div className="d-flex align-items-center flex-wrap column-names">
                            <span className="regular-title d-block mb-3">Column 1</span>
                            <div className="position-relative c-pointer select-column mb-3">
                                <img src={DownArrow} className="ico_float right" alt="Down" />
                                <select name="select-rues" id="select_rules">
                                    <option>Select</option>
                                    <option>Compatible</option>
                                    <option>Incompatible</option>
                                </select>
                            </div>
                        </div>
                        <div className="d-flex align-items-center flex-wrap column-names">
                            <span className="regular-title d-block mb-3">Column 1</span>
                            <div className="position-relative c-pointer select-column mb-3">
                                <img src={DownArrow} className="ico_float right" alt="Down" />
                                <select name="select-rues" id="select_rules">
                                    <option>Select</option>
                                    <option>Compatible</option>
                                    <option>Incompatible</option>
                                </select>
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

                <div className="other-rules mt-5">
                    <h2 className="page-title mb-4">Other Rules</h2>  
                    <div className="other-rule-lists  column-names">
                        <div className="d-md-flex align-items-center other-rules">
                            <div className="rule-input mb-3 mr-0 me-md-3">
                                <input type="text" id="rule_input" name="rule-input" placeholder="\n"/>
                            </div>                            
                            <div className="position-relative c-pointer select-column mb-3 mr-0 me-md-3">
                                <img src={DownArrow} className="ico_float right" alt="Down" />
                                <select name="select-rues" id="select_rules">
                                    <option>Select</option>
                                    <option>Compatible</option>
                                    <option>Incompatible</option>
                                </select>
                            </div>
                            <div className="rule-input mb-3">
                                <input type="text" id="replace_to" name="replace-to" placeholder="<BR>"/>
                            </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  };
export default AddColumnRules;