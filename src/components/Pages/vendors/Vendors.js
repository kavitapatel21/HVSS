import Header from "../../Layout/Header"
import Sidebar from "../../Layout/Sidebar"
import IcoSearch from "../../../assets/images/search_ico.svg"
import IcoMore from "../../../assets/images/more.svg";
import { useEffect, useState } from "react";
import { listVendorsAsync, selectVendors, deleteVendorAsync } from "../../../features/vendorSlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import AddVendor from "./AddVendor";
import EditVendor from "./EditVendor";
import Table from 'react-bootstrap/Table';

const Vendors = () => {
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

    useEffect(() => {
        if (!isAddPopupOpen || !isEditPopupOpen) {
            dispatch(listVendorsAsync());
        }
    }, [dispatch, isAddPopupOpen, isEditPopupOpen]);

    const vendors = useSelector(selectVendors);

    const [editedRow, setEditedRow] = useState(null);
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
        await dispatch(deleteVendorAsync(vendor));
        dispatch(listVendorsAsync());
        toast.success('Vendor deleted Successfully !')
    }

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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {vendors && vendors.length > 0 && vendors.map((vendor, i) => {
                            return (
                            <tr key={i}>
                                <td>{i+1}</td>
                                <td>{vendor.name}</td>
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
                        )
                        })
                        } 
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
            </div>
        </div>
      </div>
    );
  };
export default Vendors;