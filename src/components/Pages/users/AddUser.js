import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { addUserAsync } from "../../../features/userSlice";
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from "react-bootstrap";

const AddUser = ({ onClose }) => {
  const dispatch = useDispatch();
  const validate = values => {
    const errors = {};
    if (!values.username) {
      errors.username = 'User Name is Required';
    }
    if (!values.email) {
      errors.email = 'Email is Required';
    }
  
    if (!values.first_name) {
      errors.first_name = 'First Name is Required';
    }

    if (!values.last_name) {
        errors.last_name = 'Last Name is Required';
    }

    if (!values.password) {
        errors.password = 'Password is Required';
    }

    return errors;
  }

  const formik = useFormik({
    initialValues: { username: '', email: '', first_name: '', last_name: '', password: '' },
    validate,
    onSubmit: async (values) => {
      try {
        await dispatch(addUserAsync(values));
        
        onClose(); // Close the popup after submission
      } catch (error) {
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
              <label htmlFor="username" className='label-title mb-2 d-block w-100 text-left'>User Name</label>
              <input 
              type="text"
              name="username"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              />
              {formik.errors.username && formik.touched.username && <div className="error-message">{formik.errors.username}</div>}
            </div>
            
            <div className='form-group mb-4'>
              <label htmlFor="email" className='label-title mb-2 d-block w-100 text-left'>Email</label>
              <input 
              type="text"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              />
              {formik.errors.email && formik.touched.email && <div className="error-message">{formik.errors.email}</div>}
            </div>
            
            <div className='form-group mb-4'>
              <label htmlFor="first_name" className='label-title mb-2 d-block w-100 text-left'>First Name</label>
              <input 
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              />
              {formik.errors.first_name && formik.touched.first_name && <div className="error-message">{formik.errors.first_name}</div>}
            </div>
            
            <div className='form-group mb-4'>
              <label htmlFor="last_name" className='label-title mb-2 d-block w-100 text-left'>Last Name</label>
              <input 
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              />
              {formik.errors.last_name && formik.touched.last_name && <div className="error-message">{formik.errors.last_name}</div>}
            </div>
            
            <div className='form-group mb-4'>
              <label htmlFor="password" className='label-title mb-2 d-block w-100 text-left'>Password</label>
              <input 
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              />
              {formik.errors.password && formik.touched.password && <div className="error-message">{formik.errors.password}</div>}
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

export default AddUser;