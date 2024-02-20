import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import "../../../assets/scss/import.scss";
import Addrule from "../../../assets/images/add-rule.svg";
import IcoMore from "../../../assets/images/more.svg";
import IcoSearch from "../../../assets/images/search_ico.svg";
import { Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { selectSubcodes, listSubCodesAsync, selectCurrentPage, 
    totalPages, setCurrentPage, selectStatus, getError, 
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
    const totalPage = useSelector(totalPages);
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
    const [offset, setOffset] = useState(0);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        if (!isAddPopupOpen || !isPopupOpen) {
            dispatch(listSubCodesAsync({currentPage, searchQuery}));
            if(status == 'failed') {
                toast.error(errorMessage);
                navigate('/login');
            }
            if (authUser && authUser.user.role == 'admin') {
                dispatch(listVendorAsync());
            }
            dispatch(listDocAsync());
        }
    }, [dispatch, currentPage, errorMessage, status, isPopupOpen, searchQuery]);

    const getAllVendors = useSelector(allVendors);
    const getAllDocs = useSelector(allDocuments);
    const subcodes = useSelector(selectSubcodes);

    const handlePageChange = ({ selected }) => {
        dispatch(setCurrentPage(selected + 1));
        const currentPage = selected + 1;
        dispatch(listSubCodesAsync({currentPage, searchQuery}));
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

    const handleVendorClick = (eventKey, event) => {
        setSelectedVendor(eventKey);

    };
    const handleDocClick = (eventKey, event) => {
        setSelectedDoc(eventKey);
        const doc_id = eventKey;
        dispatch(listSubCodesAsync({currentPage, searchQuery, doc_id}));
    };
    
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
                        <div className="dropdown-filter">
                            <Dropdown align="start"  onSelect={handleVendorClick}>
                                <Dropdown.Toggle id="dropdown-basic">
                                    {selectedVendor ?
                                    getAllVendors.find(vendor => vendor.id == selectedVendor).username
                                    : 'Select Vendor'
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {getAllVendors && getAllVendors.map(vendor => (
                                    <Dropdown.Item key={vendor.id} eventKey={vendor.id}>
                                        {vendor.username}
                                    </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown align="start"  onSelect={handleDocClick}>
                                <Dropdown.Toggle id="dropdown-basic">
                                    {selectedDoc ?
                                    getAllDocs.find(document => document.id == selectedDoc).name
                                    : 'Select Document'
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {getAllDocs && getAllDocs.map(document => (
                                    <Dropdown.Item key={document.id} eventKey={document.id}>
                                        {document.name}
                                    </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="position-relative">
                            <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                            <input type="text" placeholder="Search" id="search" name="search" value={searchQuery} onChange={handleSearch} />
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
                                {authUser && authUser.user.role == 'admin' && (
                                <th>Vendor</th>
                                )}
                                <th style={{width: "40px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                        {subcodes && subcodes.length > 0 && subcodes.map((subcode, i) => {
                            return (
                            <tr key={i}>
                                <td className="text-center">{renderSerialNumber(i)}</td>
                                <td>
                                    <input type="text" name="key" id="key" placeholder="PDF" value={subcode.code_position} />
                                </td>
                                <td><input type="text" name="description" id="description" placeholder="PDF" value={subcode.description} /></td>
                                <td><input type="text" name="code" id="code" value={subcode.code} /></td>
                                <td><input type="text" name="doc" id="doc" value={subcode.document_id.name}/></td>
                                {authUser && authUser.user.role == 'admin' && 
                                (<td><input type="text" name="vendor_id" id="vendor_id" value={subcode.vendor_id.username}/></td>
                                )}
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
                        )
                        })
                        } 
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
                <div className="new-addition mt-4">
                    <a href="#" onClick={addSubcode} className="new-record d-flex align-items-center">
                        <img src={Addrule} width={18} height={18} className="me-3" alt="Add Record" />
                        Add record
                    </a>
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