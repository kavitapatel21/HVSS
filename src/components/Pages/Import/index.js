import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
// import Loader from "../../loader";
import "../../../assets/scss/import.scss";
import Upload from "../../../assets/images/Upload.svg"
// import IcoMore from "../../../assets/images/more.svg"

const Import = () => {
    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper search">         
            <Header />
            <div className="common-layout">
                <h2 className="page-title mb-4">Import a File</h2> 
                <div className="custom-file-upload">
                    <div className="file-upload-box">
                        <div className="input-box">
                            <input type="file" name="file-upload" id="file_upload" />
                            <div className="file-information">
                                <img src={Upload} alt="Upload" />
                                <p className="regular-title">Drop file here or <span className="highlight position-relative c-pointer"><input type="file" name="file-upload" id="file_upload" />browse</span></p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="table-wrapper">
                    <div className="table-search">
                        <div className="position-relative">
                            <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                            <input type="text" placeholder="Search" id="search" name="search" />
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>PDF</th>
                                <th>Position</th>
                                <th>Code</th>
                                <th>Description</th>
                                <th style={{width: "40px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <input type="text" name="pdf" id="pdf" placeholder="PDF" />
                                </td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" /></td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" /></td>
                                <td><input type="text" name="pdf" id="pdf" placeholder="PDF" /></td>
                                <td className="text-center" style={{width: "40px"}}><img src={IcoMore} alt="More" /></td>
                            </tr> 
                        </tbody>
                    </table>
                </div>  */}
            </div>
        </div>
      </div>
    );
  };
export default Import;