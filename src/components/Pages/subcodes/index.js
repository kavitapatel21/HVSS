import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
// import Loader from "../../loader";
import "../../../assets/scss/import.scss";
import Addrule from "../../../assets/images/add-rule.svg";
import IcoMore from "../../../assets/images/more.svg";
import IcoSearch from "../../../assets/images/search_ico.svg";
import { Dropdown } from "react-bootstrap";
import {Table} from "react-bootstrap";

const Subcodes = () => {
    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
                <h2 className="page-title mb-4">Subcodes</h2>  
                <div className="table-wrapper">
                    <div className="table-search">
                        <div className="position-relative">
                            <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                            <input type="text" placeholder="Search" id="search" name="search" />
                        </div>
                    </div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Code Position</th>
                                <th>Description</th>
                                <th>Code</th>
                                <th>PDF Name</th>
                                <th style={{width: "40px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="text" name="pdf" id="pdf" placeholder="PDF" value={"01"} />
                                </td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" value={"Electro Hydrulic Valve"} /></td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" value={"WEH"} /></td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" value={"re23178_2019.pdf"}/></td>
                                <td className="text-center" style={{width: "40px"}}>
                                    <Dropdown>
                                        <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
                                            <img src={IcoMore} alt="More" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/add-rules">Add rule</Dropdown.Item> 
                                            <Dropdown.Item href="#/action-1">Edit</Dropdown.Item> 
                                            <Dropdown.Item href="#/action-1">Delete</Dropdown.Item> 
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr> 
                            <tr>
                                <td>
                                    <input type="text" name="pdf" id="pdf" placeholder="PDF" value={"02"} />
                                </td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" value={"Electro Hydrulic Valve"} /></td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" value={"WEH"} /></td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" value={"re23178_2019.pdf"}/></td>
                                <td className="text-center" style={{width: "40px"}}>
                                    <Dropdown>
                                        <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
                                            <img src={IcoMore} alt="More" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/add-rules">Add rule</Dropdown.Item> 
                                            <Dropdown.Item href="#/action-1">Edit</Dropdown.Item> 
                                            <Dropdown.Item href="#/action-1">Delete</Dropdown.Item> 
                                        </Dropdown.Menu>
                                    </Dropdown>    
                                </td>
                            </tr> 
                        </tbody>
                    </Table>
                </div> 
                <div className="new-addition mt-4">
                    <a href="" className="new-record d-flex align-items-center">
                        <img src={Addrule} width={18} height={18} className="me-3" alt="Add Rule" />
                        Add record
                    </a>
                </div>
            </div>
        </div>
      </div>
    );
  };
export default Subcodes;