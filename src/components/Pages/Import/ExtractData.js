import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header"; 
import "../../../assets/scss/import.scss" 
import CancelRecord from "../../../assets/images/close-color.svg"
import IcoSearch from "../../../assets/images/search_ico.svg";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useDrag, useDrop } from "react-dnd"; 
import { Table } from "react-bootstrap";

const ExtractedData = () => {    
    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout"> 
                <h2 className="page-title mb-4">Extracted Data</h2>  
                    <div className="table-wrapper extract">
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
                                    <th style={{width: "40%"}}>Description</th>
                                    <th>Code</th>
                                    <th>Column 4</th>
                                    <th style={{width: "40px"}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                <DndProvider backend={HTML5Backend}> 
                                    <tr>
                                        <td>
                                            01  
                                        </td>
                                        <td>Electro Hydrulic Valve</td>
                                        <td> WEH   </td>
                                        <td>                                        
                                            re23178_2019.pdf 
                                        </td>
                                        <td className="text-center" style={{width: "40px"}}>   
                                            <img src={CancelRecord} width={24} height={24} className="c-pointer" alt="Cancel" /> 
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td>
                                            02   
                                        </td>
                                        <td>Electro Hydrulic Valve</td>
                                        <td> WEH   </td>
                                        <td>                                        
                                            re23178_2019.pdf 
                                        </td>
                                        <td className="text-center" style={{width: "40px"}}>   
                                            <img src={CancelRecord} width={24} height={24} className="c-pointer" alt="Cancel" /> 
                                        </td>
                                    </tr>  
                                </DndProvider>
                            </tbody>
                        </Table>
                    </div> 
            </div>
        </div>
      </div>
    );
  };
export default ExtractedData; 
 