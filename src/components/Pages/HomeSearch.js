import Header from "../../components/Layout/Header"
import Sidebar from "../../components/Layout/Sidebar"
import "../../assets/scss/search.scss";
import IcoSearch from "../../assets/images/search_ico.svg"
// import IcoMore from "../../../assets/images/more.svg"
import {Table} from "react-bootstrap"

const HomeSearch = () => {
    return (
      <div className="d-flex">  
        <Sidebar />
        <div className="page-wrapper search">         
            <Header />
            <div className="common-layout">
                <h2 className="page-title mb-4">Search</h2> 
                <div className="table-wrapper p-3">
                    <div className="search-data mx-auto">
                        <div className="table-search px-0">
                            <div className="position-relative">
                                <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                                <input type="text" placeholder="Search" id="search" name="search" />
                            </div>
                        </div>
                        <Table className="mt-4" responsive>
                            <thead>
                                <tr>
                                    <th style={{width: "30%"}}>Code</th>
                                    <th style={{width: "70%"}}>Description</th> 
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        4
                                    </td>
                                    <td>4-way version</td> 
                                </tr> 
                                <tr>
                                    <td>
                                        WEH
                                    </td>
                                    <td>Electro-hydraulic</td> 
                                </tr> 
                                <tr>
                                    <td>
                                    7X
                                    </td>
                                    <td>Component series 70…79 (70…79: unchanged installation and connection
                                        dimensions) – NG16 (from series 72) and NG25 ("W.H 22")
                                    </td> 
                                </tr> 
                            </tbody>
                        </Table>
                    </div>
                </div> 
            </div>
        </div>
      </div>
    );
  };
export default HomeSearch;