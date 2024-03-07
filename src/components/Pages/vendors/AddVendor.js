import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { addVendorAsync } from "../../../features/vendorSlice";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AddVendor = ({ onClose }) => {
  const dispatch = useDispatch();
  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is Required';
    }

    return errors;
  }

  const formik = useFormik({
    initialValues: { name: '' },
    validate,
    onSubmit: async (values) => {
      try {
        await dispatch(addVendorAsync(values));
        onClose(); // Close the popup after submission
        toast.success('Vendor Added Successfully !')
      } catch (error) {
        toast.error(error);
        console.error('An error occurred:', error);
      }
    },
  });
  
  const authUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
  return (
    <div className="popup">
      <div className="popup-inner">
        <form onSubmit={formik.handleSubmit}>
           <div className='form-group mb-4'>
              <label htmlFor="name" className='label-title mb-2 d-block w-100 text-left'>Name</label>
              <input 
              type="text"
              name="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name && <div className="error-message">{formik.errors.name}</div>}
            </div>
        
            
            <div className="action-buttons">
                <button type="submit" className='primary-button'>Add</button>
                <button className='primary-button' onClick={onClose}>Cancel</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;