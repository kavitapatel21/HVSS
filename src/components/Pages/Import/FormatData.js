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
import { createMultipleSubCode } from "../../../services/subcode.service";
import { useNavigate } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { clearData } from "../../../features/importFileSlice";
import Swal from 'sweetalert2'

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
  const [editedRow, setEditedRow] = useState(initialValues);
  const [rowIndex, setRowIndex] = useState(0);

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

  const deleteRecord = (id) => {
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
        const updatedData = data.filter((rowData, index) => index  !== id);
        setData(updatedData);
      }
    })
  }

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const formik = useFormik({
    initialValues: initialValues, // Use formValues if available, otherwise use initialValues
    onSubmit: async (values) => {
      try {
        console.log(data);
        if (rowIndex !== null) { // Check if rowIndex is not null
          const updatedData = [...data];
          if (rowIndex !== null && updatedData[rowIndex]) {
            updatedData[rowIndex][0] = values.code_position;
            updatedData[rowIndex][1] = values.description;
            updatedData[rowIndex][2] = values.code;
          }
        }
        setEditedRow(null);
        setIsPopupOpen(false);
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
  }, [location.state]);
    
  const savesubcode = async () => {
    const reformatData = data.map((record) => ({
      code_position: record[0],
      description: record[1],
      code: record[2],
      document_id: document,
    }))
    .filter((record) => record.code_position.trim() !== '' && record.code.trim() !== '');
    await createMultipleSubCode(reformatData);
    navigate('/subcodes');
    dispatch(clearData());
  }

    return (
      <div className="d-flex">
        <Sidebar />
        <div className="page-wrapper">         
        <Header />
        <div className="common-layout">
          <h2 className="page-title mb-4">Formatted Data</h2>  
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
 