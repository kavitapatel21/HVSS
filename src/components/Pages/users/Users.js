import Header from "../../Layout/Header"
import Sidebar from "../../Layout/Sidebar"
import IcoSearch from "../../../assets/images/search_ico.svg"
import IcoMore from "../../../assets/images/more.svg";
import { useEffect, useState } from "react";
import { listUsersAsync, selectUsers, deleteUserAsync } from "../../../features/userSlice";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import { Dropdown } from "react-bootstrap";
import AddUser from "./AddUser";
import EditUser from "./EditUser";

const Users = () => {
    const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

    useEffect(() => {
        if (!isAddPopupOpen || !isEditPopupOpen) {
            dispatch(listUsersAsync());
        }
    }, [dispatch, isAddPopupOpen, isEditPopupOpen]);

    const users = useSelector(selectUsers);

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
    const addUser = () => {
        setIsAddPopupOpen(true);
    };
    
    const handleDeleteUser = (user) => {
        dispatch(deleteUserAsync(user));
    }

    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
                <h2 className="page-title mb-4">Users</h2>  
                <div className="table-wrapper">
                    <div className="table-search">
                        <div className="position-relative">
                            <button className='primary-button ms-auto' onClick={addUser}>Add User</button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th style={{width: "40px"}}></th>
                            </tr>
                        </thead>
                        <tbody>
                        {users && users.length > 0 && users.map((user, i) => {
                            return (
                            <tr key={i}>
                                <td className="text-center">{i+1}</td>
                                <td>
                                    <input type="text" name="username" id="username" value={user.username} />
                                </td>
                                <td><input type="text" name="email" id="email" value={user.email} /></td>
                                <td className="text-center" style={{width: "40px"}}>
                                    <Dropdown>
                                        <Dropdown.Toggle className="transparent-button" id="dropdown-basic">
                                            <img src={IcoMore} alt="More" />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item href="#" onClick={() => handleEditPopup(user)}>Edit</Dropdown.Item> 
                                            <Dropdown.Item href="#" onClick={() => handleDeleteUser(user.id)}>Delete</Dropdown.Item> 
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        )
                        })
                        } 
                        </tbody>
                    </table>
                    {isAddPopupOpen && (
                    <Modal backdrop="static" size="md" show={isAddPopupOpen} onHide={() => setIsAddPopupOpen(false)}>
                        <Modal.Header closeButton> Add User </Modal.Header>
                        <Modal.Body><AddUser onClose={closeAddPopup} /> </Modal.Body>
                    </Modal>
                    )}
                    {isEditPopupOpen && (
                    <Modal backdrop="static" size="md" show={isEditPopupOpen} onHide={() => setIsEditPopupOpen(false)}>
                        <Modal.Header closeButton> Edit User </Modal.Header>
                        <Modal.Body><EditUser rowData={editedRow} onClose={closeEditPopup}/> </Modal.Body>
                    </Modal>
                )}
                </div>
            </div>
        </div>
      </div>
    );
  };
export default Users;