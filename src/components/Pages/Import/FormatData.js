import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header"; 
import "../../../assets/scss/import.scss" 
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import CancelRecord from "../../../assets/images/trash.svg"
import EditRecord from "../../../assets/images/edit.svg"
import { Modal } from "react-bootstrap";
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { addMultipleCodeAsync, multipleCodeStatus } from "../../../features/subcodeSlice";
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { clearData } from "../../../features/importFileSlice";
import Swal from 'sweetalert2'
import Addrule from "../../../assets/images/add-rule.svg";
import { toast } from "react-toastify";

const FormatData = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const initialValues = {
    code_position: '',
    description: '',
    code: ''
  }

  const [data, setData] = useState([]);
  const [document, setDocument] = useState(0);
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [editedRow, setEditedRow] = useState(initialValues);
  const [rowIndex, setRowIndex] = useState(0);
  const [actionStack, setActionStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const multiCodeStatus = useSelector(multipleCodeStatus);

  const editRecord = (row) => {
    setRowIndex(row);
    setEditedRow(data[row]);
    const values = {
      code_position:data[row][0],
      description: data[row][1],
      code: data[row][2],
    };

    formik.setValues(values);
    setIsPopupOpen(true);
  }

  const deleteRecord = (rowIndex) => {
    Swal.fire({
      title: 'Are you sure to remove this record?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const deletedRecord = data[rowIndex];
        const updatedData = data.filter((rowData, index) => index  !== rowIndex);
        setData(updatedData);
        setActionStack([...actionStack, { type: 'delete', rowIndex, deletedRecord }]);
        setRedoStack([]);
      }
    })
  }

  const undoAction = () => {
    if (actionStack.length > 0) {
      const lastAction = actionStack.pop(); // Get the last action from the stack
      if (lastAction.type === 'delete') {
        const { rowIndex, deletedRecord } = lastAction;
        const newData = [...data];
        newData.splice(rowIndex, 0, deletedRecord);
        setData(newData);
        setRedoStack([...redoStack, lastAction]);
      } else if (lastAction.type === 'edit') {
        const { rowIndex, previousState, currentState } = lastAction;
        const updatedData = [...data];
        updatedData[rowIndex] = previousState; // Restore the current state
        setData(updatedData);
        setRedoStack([...redoStack, lastAction]);
      } else if (lastAction.type === 'add') {
        const updatedData = [...data];
        updatedData.pop();
        setData(updatedData);
        setRedoStack([...redoStack, lastAction]);
      }
    }
  };

  const redoAction = () => {
    const lastRedoAction = redoStack.pop();
      if (lastRedoAction.type == 'edit') {
        const { rowIndex, currentState } = lastRedoAction;
        const updatedData = [...data];
        updatedData[rowIndex] = currentState; // Restore previous state
        setData(updatedData);
        setActionStack([...actionStack, lastRedoAction]); // Re-add the undone action to the undo stack
      } else if (lastRedoAction.type == 'delete') {
        const { rowIndex, deletedRecord } = lastRedoAction;
        const updatedData = [...data];
        updatedData.splice(rowIndex, 1);
        setData(updatedData);
        setActionStack([...actionStack, lastRedoAction]); // Re-add the undone action to the undo stack
      } else if (lastRedoAction.type == 'add') {
        const { newRecord } = lastRedoAction;
        setData([...data, newRecord]); // Add the new record back to the data
        setActionStack([...actionStack, lastRedoAction]);
      }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const closeAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const formik = useFormik({
    initialValues: initialValues, // Use formValues if available, otherwise use initialValues
    onSubmit: async (values) => {
      try {
        if (rowIndex !== null) { // Check if rowIndex is not null
          const previousState = [...data[rowIndex]];
          const updatedData = [...data];
          if (rowIndex !== null && updatedData[rowIndex]) {
            updatedData[rowIndex][0] = values.code_position;
            updatedData[rowIndex][1] = values.description;
            updatedData[rowIndex][2] = values.code;
          }
          const currentState = updatedData[rowIndex];
          setData(updatedData);
          setActionStack([...actionStack, { type: 'edit', rowIndex, previousState, currentState }]);
          setRedoStack([]);
        }
        setEditedRow(null);
        setIsPopupOpen(false);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
  });

  const formik2 = useFormik({
    initialValues: initialValues, // Use formValues if available, otherwise use initialValues
    onSubmit: async (values) => {
      try {
        const updatedData = [...data];
        const newRecord = [
          values.code_position,
          values.description,
          values.code,
        ];        
        updatedData.push(newRecord);
        setData(updatedData);
        setIsAddPopupOpen(false);
        setActionStack([...actionStack, { type: 'add', newRecord }]);
        setRedoStack([]);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
  });

  useEffect(() => {
    const { formattedData, docId } = location.state;
    if (formattedData) {
      setData(formattedData.data);
    }
  
    if (docId) {
      setDocument(docId)
    }
  }, [location.state, dispatch]);
    
  const savesubcode = async () => {
    const reformatData = data.map((record) => ({
      code_position: record[0],
      description: record[1],
      code: record[2],
      document_id: document,
    }));
    
    const hasEmptyFields = reformatData.some(record => record.code_position.trim() == '' || record.code.trim() == '');
    if (hasEmptyFields) {
      toast.error('Some records have empty code position or code. Please check and edit them!')
    } else {
      reformatData.filter((record) => record.code_position.trim() !== '' && record.code.trim() !== '');
      await dispatch(addMultipleCodeAsync(reformatData));
      if (multiCodeStatus == 'failed') {
        toast.error('Please Enter Valid Data. Code Position should be Integer, Description & Code should be String.')
      } else if (multiCodeStatus == 'success') {
        navigate('/subcodes');
        dispatch(clearData());
      }
    }
  }

  const addSubcode = () => {
    setIsAddPopupOpen(true);
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrapper">         
      <Header />
      <div className="common-layout">
        <div className="d-md-flex align-items-center justify-content-between mb-4">
        <h2 className="page-title mb-0">Formatted Data</h2>
          <div className="new-addition d-flex align-items-center">
            <a onClick={addSubcode} className="new-record">
              <img src={Addrule} width={18} height={18} className="me-3" alt="Add Record" />
              Add record
            </a>
            <button className='primary-button ms-3' onClick={undoAction} disabled={actionStack.length === 0}>Undo</button>
            <button className='primary-button ms-3' onClick={redoAction} disabled={redoStack.length === 0}>
              Redo
            </button>
          </div>
        </div>
            
        <div className="table-wrapper">
          <Table striped>
            <thead>
                <tr>
                  {/* <th className="text-center">Sr No.</th> */}
                  <th>Code Position</th>
                  <th>Description</th>
                  <th>Code</th>
                  <th colSpan={2}>Actions</th>
                </tr>
            </thead>
            <tbody>
            {data.map((rowData, index) => {
              return (
                <tr key={index}>
                  <td className="text-center d-none">{index}</td>
                  {rowData.map((cellData, cellIndex) => (
                    <td key={cellIndex}>{cellData}</td>
                  ))}
                  <td onClick={() => editRecord(index)}>
                    <img src={EditRecord} width={18} height={18} className="c-pointer" alt="Edit" />
                  </td>
                  <td onClick={() => deleteRecord(index)}>
                    <img src={CancelRecord} width={18} height={18} className="c-pointer" alt="Cancel" />
                  </td>
                </tr>
              );
            })}
            </tbody>
          </Table>
          {isPopupOpen && (
          <Modal backdrop="static" size="md" show={isPopupOpen} onHide={() => setIsPopupOpen(false)}>
              <Modal.Header closeButton> Edit </Modal.Header>
              <Modal.Body>
              <form onSubmit={formik.handleSubmit}>
                <div className='form-group mb-4'>
                    <label htmlFor="code_position" className='label-title mb-2 d-block w-100 text-left'>Code Position</label>
                    <input 
                    type="text"
                    name="code_position"
                    placeholder="Code Position"
                    value={formik.values.code_position}
                    onChange={formik.handleChange}
                    />
                </div>
                <div className='form-group mb-4'>
                  <label htmlFor="description" className='label-title mb-2 d-block w-100 text-left'>Description</label>
                  <input 
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  />
                </div>
                <div className='form-group mb-4'>
                  <label htmlFor="description" className='label-title mb-2 d-block w-100 text-left'>Code</label>
                  <input 
                  type="text"
                  name="code"
                  placeholder="Code"
                  value={formik.values.code}
                  onChange={formik.handleChange}
                  />
                </div>
                <div className="action-buttons">
                  <button type="submit" className='primary-button'>Edit</button>
                  <button className='primary-button' onClick={closePopup}>Cancel</button>
                </div>
              </form>
              </Modal.Body>
          </Modal>
          )}
          {isAddPopupOpen && (
            <Modal backdrop="static" size="md" show={isAddPopupOpen} onHide={() => setIsAddPopupOpen(false)}>
              <Modal.Header closeButton> Add Subcode </Modal.Header>
              <Modal.Body>
              <form onSubmit={formik2.handleSubmit}>
                <div className='form-group mb-4'>
                    <label htmlFor="code_position" className='label-title mb-2 d-block w-100 text-left'>Code Position</label>
                    <input 
                    type="text"
                    name="code_position"
                    placeholder="Code Position"
                    onChange={formik2.handleChange}
                    />
                </div>
                <div className='form-group mb-4'>
                  <label htmlFor="description" className='label-title mb-2 d-block w-100 text-left'>Description</label>
                  <input 
                  type="text"
                  name="description"
                  placeholder="Description"
                  onChange={formik2.handleChange}
                  />
                </div>
                <div className='form-group mb-4'>
                  <label htmlFor="description" className='label-title mb-2 d-block w-100 text-left'>Code</label>
                  <input 
                  type="text"
                  name="code"
                  placeholder="Code"
                  onChange={formik2.handleChange}
                  />
                </div>
                <div className="action-buttons">
                  <button type="submit" className='primary-button'>Add</button>
                  <button className='primary-button' onClick={closeAddPopup}>Cancel</button>
                </div>
              </form>
              </Modal.Body>
          </Modal>
          )}
        </div>
        <div className="text-end mt-4">
          <button onClick={savesubcode} className="primary-button ms-auto">Save</button>
        </div>
      </div>
  </div>
    </div>
  );
  };
export default FormatData; 
 