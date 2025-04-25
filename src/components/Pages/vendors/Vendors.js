import Header from "../../Layout/Header"
import Sidebar from "../../Layout/Sidebar"
import IcoMore from "../../../assets/images/more.svg";
import { useEffect, useState } from "react";
import { listAllVendorsAsync, vendorsList, deleteVendorAsync, setCurrentPage, selectCurrentPage, count } from "../../../features/vendorSlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import AddVendor from "./AddVendor";
import EditVendor from "./EditVendor";
import Table from 'react-bootstrap/Table';
import { showConfirmationDialog } from "../../../utils/SweetAlert";
import Pagination from "../Pagination";
import Loader from "../../loader";

const Vendors = () => {
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [totalPage, setTotalPages] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [offset, setOffset] = useState(0);

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const currentPage = useSelector(selectCurrentPage);
    const getcount = useSelector(count);
    const vendors = useSelector(vendorsList);
    const [editedRow, setEditedRow] = useState(null);

    useEffect(() => {
        if (!isAddPopupOpen || !isEditPopupOpen) {
            setIsLoading(true);
            dispatch(listAllVendorsAsync({currentPage, perPage})).finally(() => setIsLoading(false));
        }
    }, [dispatch, isAddPopupOpen, isEditPopupOpen, currentPage, perPage]);
    
    useEffect(() => {
        if (getcount && perPage) {
          const pages = Math.ceil(getcount / perPage);
          setTotalPages(pages);
        }
    }, [getcount, perPage]);

    const handleEditPopup = (row) => {
        setEditedRow(row);
        setIsEditPopupOpen(true);
    }
    const closeEditPopup = () => {
        setIsEditPopupOpen(false);
    };

    const closeAddPopup = () => {
        setIsAddPopupOpen(false);
    };
    const addVendor = () => {
        setIsAddPopupOpen(true);
    };
    
    const handleDeleteVendor = async (vendor) => {
        showConfirmationDialog(
            'Are you sure to delete this record?',
            'You will not be able to recover this record!',
            'warning',
            'Yes, delete it!',
            'No, cancel',
            true,
            async () => {
                await dispatch(deleteVendorAsync(vendor));
                dispatch(listAllVendorsAsync({currentPage, perPage}));
                toast.success('Vendor deleted Successfully !');
          }
        );
    }

    const handlePageChange = ({ selected }) => {
        dispatch(setCurrentPage(selected + 1));
        const currentPage = selected + 1;
        dispatch(listAllVendorsAsync({currentPage, perPage}));
        setOffset(selected * perPage);
    };

    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
                <h2 className="page-title mb-4">Vendors</h2>  
                <div className="table-wrapper">
                    <div className="table-search">
                        <div className="position-relative">
                            <button className='primary-button ms-auto' onClick={addVendor}>Add Vendor</button>
                        </div>
                    </div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Name</th>
                                <th>Code Seperator</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                        <Loader />
                        ) : 
                        (vendors && vendors.length === 0) ?  (
                            <tr>
                            <td colSpan="6" className="text-center">No data found</td>
                            </tr>
                        ) : 
                        (vendors && vendors.length > 0 && vendors.map((vendor, i) => {
                            return (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{vendor.name}</td>
                                <td>{vendor.separator}</td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
                                            <img src={IcoMore} alt="More" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#" onClick={() => handleEditPopup(vendor)}>Edit</Dropdown.Item> 
                                            <Dropdown.Item href="#" onClick={() => handleDeleteVendor(vendor.id)}>Delete</Dropdown.Item> 
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        )})
                        )}
                        </tbody>
                    </Table>
                    {isAddPopupOpen && (
                    <Modal backdrop="static" size="md" show={isAddPopupOpen} onHide={() => setIsAddPopupOpen(false)}>
                        <Modal.Header closeButton> Add Vendor </Modal.Header>
                        <Modal.Body><AddVendor onClose={closeAddPopup} /> </Modal.Body>
                    </Modal>
                    )}
                    {isEditPopupOpen && (
                    <Modal backdrop="static" size="md" show={isEditPopupOpen} onHide={() => setIsEditPopupOpen(false)}>
                        <Modal.Header closeButton> Edit Vendor </Modal.Header>
                        <Modal.Body><EditVendor rowData={editedRow} onClose={closeEditPopup}/> </Modal.Body>
                    </Modal>
                    )}
                </div>
                <Pagination
                    totalPage={totalPage}
                    handlePageChange={handlePageChange}
                    currentPage={currentPage}
                />
            </div>
        </div>
      </div>
    );
  };
export default Vendors;