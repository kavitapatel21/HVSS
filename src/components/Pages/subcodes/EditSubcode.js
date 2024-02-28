import { useFormik } from 'formik';
import { updateSubCodeAsync } from "../../../features/subcodeSlice";
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from "react-bootstrap";

const EditSubcode = ({ rowData, onSave, onClose, vendors, documents }) => {
  const dispatch = useDispatch();
  const validate = values => {
    const errors = {};
    if (!values.code_position && formik.touched.code_position) {
      errors.position = 'Position is Required';
    }
    if (!values.description && formik.touched.description) {
      errors.description = 'Description is Required';
    }
  
    if (!values.code && formik.touched.code) {
      errors.code = 'Code is Required';
    }
  
    return errors;
  }

  const formik = useFormik({
    initialValues: rowData,
    validate,
    onSubmit: async (values) => {
      try {
        await dispatch(updateSubCodeAsync(values));
        
        // After the action is completed, call onClose to close the popup
        onClose(); // Close the popup after submission
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
  });
  
  const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  const handleVendorClick = (vendorId) => {
    formik.setFieldValue('vendor_id', vendors.find(vendor => vendor.id === vendorId));
  };
  const handleDocClick = (docId) => {
    formik.setFieldValue('document_id', documents.find(document => document.id === docId));
  };
  return (
    <div className="popup edit-subcode">
      <div className="popup-inner">
        <form onSubmit={formik.handleSubmit}>
           <div className='form-group mb-4'>
              <label htmlFor="position" className='label-title mb-2 d-block w-100 text-left'>Code Position</label>
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
              placeholder="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              />
            </div>
            <div className='form-group mb-4'>
              <label htmlFor="code" className='label-title mb-2 d-block w-100 text-left'>Code</label>
              <input 
              type="text"
              name="code"
              placeholder="Code"
              value={formik.values.code}
              onChange={formik.handleChange}
              />
            </div>
            { authUser && authUser.user.role == 'admin' && (
              <div className='form-group mb-4'>
              <label htmlFor="vendor_id" className='label-title mb-2 d-block w-100 text-left'>Vendor</label>
              <Dropdown align="start">
                <Dropdown.Toggle id="dropdown-basic">
                    {formik.values.vendor_id.name}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {vendors && vendors.map(vendor => (
                    <Dropdown.Item key={vendor.id} href='#' 
                        active={vendor.id == formik.values.vendor_id.id} 
                        onClick={() => handleVendorClick(vendor.id)}>
                        {vendor.name}
                    </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            )}
            <div className='form-group mb-4'>
              <label htmlFor="document_id" className='label-title mb-2 d-block w-100 text-left'>Document</label>
                <Dropdown align="start">
                  <Dropdown.Toggle id="dropdown-basic">
                      {formik.values.document_id.name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                      {documents && documents.map(document => (
                      <Dropdown.Item key={document.id} href='#' 
                          active={document.name == formik.values.document_id.name} 
                          onClick={() => handleDocClick(document.id)}>
                          {document.name}
                      </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>
            </div>
            <div className="action-buttons">
              <button type="submit" className='primary-button'>Update</button>
              <button className='primary-button' onClick={onClose}>Cancel</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditSubcode;