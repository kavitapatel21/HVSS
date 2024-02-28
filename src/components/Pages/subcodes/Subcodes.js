import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import "../../../assets/scss/import.scss";
import Addrule from "../../../assets/images/add-rule.svg";
import IcoMore from "../../../assets/images/more.svg";
import IcoSearch from "../../../assets/images/search_ico.svg";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { selectSubcodes, listSubCodesAsync, selectCurrentPage, 
    count, setCurrentPage, selectStatus, getError, 
    listVendorAsync, allVendors, listDocAsync, allDocuments,
    deleteSubCodeAsync } from "../../../features/subcodeSlice";
import { useDispatch, useSelector } from 'react-redux';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import EditSubcode from "../../Pages/subcodes/EditSubcode";
import { Modal } from "react-bootstrap";
import AddSubcode from "./AddSubcode";

const Subcodes = () => {
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const getcount = useSelector(count);
    const [totalPage, setTotalPages] = useState(0);
    const currentPage = useSelector(selectCurrentPage);
    const status = useSelector(selectStatus);
    const errorMessage = useSelector(getError);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };
    const [perPage, setPerPage] = useState(10);
    const perPageOptions = [5, 10, 20, 50, 100];
    const [offset, setOffset] = useState(0);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(0);
    const [selectedDoc, setSelectedDoc] = useState(0);

    useEffect(() => {
        if (!isAddPopupOpen || !isPopupOpen) {
            dispatch(listSubCodesAsync({currentPage, searchQuery, selectedVendor, selectedDoc, perPage}));
            if(status == 'failed') {
                toast.error(errorMessage);
                navigate('/login');
            }
            if (authUser && authUser.user.role == 'admin') {
                dispatch(listVendorAsync());
            }
            dispatch(listDocAsync());
            const pages = Math.ceil(getcount / perPage);
            setTotalPages(pages);
        }
    }, [dispatch, currentPage, errorMessage, status, isPopupOpen, selectedDoc, selectedVendor, perPage, getcount]);

    const getAllVendors = useSelector(allVendors);
    const getAllDocs = useSelector(allDocuments);
    const subcodes = useSelector(selectSubcodes);

    const handlePageChange = ({ selected }) => {
        dispatch(setCurrentPage(selected + 1));
        const currentPage = selected + 1;
        dispatch(listSubCodesAsync({currentPage, searchQuery, selectedVendor, selectedDoc, perPage}));
        setOffset(selected * perPage);
    };

    const [editedRow, setEditedRow] = useState(null);
    const handleEditPopup = (row) => {
        setEditedRow(row);
        setIsPopupOpen(true);
    }

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const handleSave = ( editedData) => {
    // Handle saving the edited data
        console.log("Saved data:", editedData);
    };

    const handleDeleteCode = (code) => {
        dispatch(deleteSubCodeAsync(code));
    }

    const renderSerialNumber = (index) => {
        return index + offset + 1;
    };

    const addSubcode = () => {
        setIsAddPopupOpen(true);
    }

    const closeAddPopup = () => {
        setIsAddPopupOpen(false);
    };

    const handleVendorClick = (eventKey) => {
        setSelectedVendor(eventKey);
    };
    const handleDocClick = (eventKey) => {
        setSelectedDoc(eventKey);
    };

    const handlePerPage = (eventKey) => {
        setPerPage(eventKey);
        const perPage = eventKey;
        dispatch(listSubCodesAsync({currentPage, searchQuery, selectedVendor, selectedDoc, perPage}));
    }
    
    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
                <div className="d-md-flex align-items-center justify-content-between mb-4">
                    <h2 className="page-title mb-md-0 mb-3">Subcodes</h2>
                    <div className="new-addition">
                        <a href="#" onClick={addSubcode} className="new-record d-flex align-items-center">
                            <img src={Addrule} width={18} height={18} className="me-3" alt="Add Record" />
                            Add record
                        </a>
                    </div>  
                </div>
                <div className="table-wrapper">
                    <div className="table-search d-md-flex align-items-center justify-content-between">
                        <div className="dropdown-filter d-md-flex align-items-center">
                            <Dropdown align="start"  onSelect={handleVendorClick}>
                                <Dropdown.Toggle id="dropdown-basic" className="outline-button me-0 me-md-2">
                                    {selectedVendor && selectedVendor != 0 ?
                                    getAllVendors.find(vendor => vendor.id == selectedVendor).name
                                    : 'Select Vendor'
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item key="0" eventKey="0" active={selectedVendor == 0}>
                                        Select Vendor
                                    </Dropdown.Item>
                                    {getAllVendors && getAllVendors.map(vendor => (
                                    <Dropdown.Item key={vendor.id} eventKey={vendor.id} active={selectedVendor == vendor.id}>
                                        {vendor.name}
                                    </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown align="start"  onSelect={handleDocClick}>
                                <Dropdown.Toggle id="dropdown-basic" className="outline-button">
                                    {selectedDoc && selectedDoc != 0 ?
                                    getAllDocs.find(document => document.id == selectedDoc).name
                                    : 'Select Document'
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item key="0" eventKey="0" active={selectedDoc == 0}>
                                        Select Document
                                    </Dropdown.Item>
                                    {getAllDocs && getAllDocs.map(document => (
                                    <Dropdown.Item key={document.id} eventKey={document.id} active={selectedDoc == document.id}>
                                        {document.name}
                                    </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="d-md-flex align-items-center">
                            <div className="position-relative me-0 me-md-2">
                                <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                                <input type="text" placeholder="Search" id="search" name="search" value={searchQuery} onChange={handleSearch} />
                            </div>
                            <Dropdown align="start"  onSelect={handlePerPage}>
                                <Dropdown.Toggle id="dropdown-basic" className="outline-button">
                                    {perPage}
                                </Dropdown.Toggle>
                                <Dropdown.Menu> 
                                {perPageOptions.map((option, index) => (
                                    <Dropdown.Item  eventKey={option} 
                                        active={option == perPage} >    
                                        {option}
                                    </Dropdown.Item> 
                                ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Code Position</th>
                                <th>Description</th>
                                <th>Code</th>
                                <th>PDF Name</th>
                                <th>Vendor</th>
                                <th style={{width: "40px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                        {subcodes && subcodes.length === 0 ?  (
                            <tr>
                            <td colSpan="6" className="text-center">No data found</td>
                            </tr>
                        ) : (
                        subcodes && subcodes.length > 0 && subcodes.map((subcode, i) => {
                            return (
                            <tr key={i}>
                                <td className="text-center">{renderSerialNumber(i)}</td>
                                <td>
                                    <input type="text" name="key" id="key" placeholder="PDF" value={subcode.code_position} />
                                </td>
                                <td><input type="text" name="description" id="description" placeholder="PDF" value={subcode.description} /></td>
                                <td><input type="text" name="code" id="code" value={subcode.code} /></td>
                                <td><input type="text" name="doc" id="doc" value={subcode.document_id.name}/></td>
                                <td><input type="text" name="vendor_id" id="vendor_id" value={subcode.vendor_id ? subcode.vendor_id.name : 'N/A'}/></td>
                                <td className="text-center" style={{width: "40px"}}>
                                    <Dropdown>
                                        <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
                                            <img src={IcoMore} alt="More" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="/add-rules">Add rule</Dropdown.Item> 
                                            <Dropdown.Item href="#" onClick={() => handleEditPopup(subcode)}>Edit</Dropdown.Item> 
                                            <Dropdown.Item href="#" onClick={() => handleDeleteCode(subcode.id)}>Delete</Dropdown.Item> 
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        )})
                        )}
                        </tbody>
                    </table>
                    {isPopupOpen && (
                    <Modal backdrop="static" size="md" show={isPopupOpen} onHide={() => setIsPopupOpen(false)}>
                        <Modal.Header closeButton> Edit Subcode </Modal.Header>
                        <Modal.Body><EditSubcode rowData={editedRow} onSave={handleSave} onClose={closePopup} vendors={getAllVendors} documents={getAllDocs}/> </Modal.Body>
                    </Modal>
                    )}
                    {isAddPopupOpen && (
                    <Modal backdrop="static" size="md" show={isAddPopupOpen} onHide={() => setIsAddPopupOpen(false)}>
                        <Modal.Header closeButton> Add Subcode </Modal.Header>
                        <Modal.Body><AddSubcode onClose={closeAddPopup} vendors={getAllVendors} documents={getAllDocs}/> </Modal.Body>
                    </Modal>
                    )}
                </div>
                <ReactPaginate
                    pageCount={totalPage}
                    onPageChange={handlePageChange}
                    containerClassName={'pagination'}
                    activeClassName={'active'}
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                />
            </div>
        </div>
      </div>
    );
  };
export default Subcodes;