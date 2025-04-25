import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { addProductAsync } from "../../../features/scrapingSlice";
import { useSelector, useDispatch } from 'react-redux';

const AddProduct = ({ onClose }) => {
  const dispatch = useDispatch();
  const validate = values => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Product Name is Required';
    }
    if (!values.price) {
      errors.price = 'Price is Required';
    }
    if (!values.model_number) {
      errors.model_number = 'Model Number is Required';
    }
    return errors;
  }

  const formik = useFormik({
    initialValues: { name: '', price: '', model_number: ''},
    validate,
    onSubmit: async (values) => {
      try {
        await dispatch(addProductAsync(values));
        onClose(); // Close the popup after submission
      } catch (error) {
        console.error('An error occurred:', error);
      }
    },
  });
  
  return (
    <div className="popup">
      <div className="popup-inner">
      <form onSubmit={formik.handleSubmit}>
        <div className='form-group mb-4'>
          <label htmlFor="name" className='label-title mb-2 d-block w-100 text-left'>Product Name</label>
          <input 
          type="text"
          name="name"
          placeholder="Product Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          />
          {formik.errors.name && formik.touched.name && <div className="error-message">{formik.errors.name}</div>}
        </div>
        
        <div className='form-group mb-4'>
          <label htmlFor="price" className='label-title mb-2 d-block w-100 text-left'>Price</label>
          <input 
          type="text"
          name="price"
          placeholder="Price"
          value={formik.values.price}
          onChange={formik.handleChange}
          />
          {formik.errors.price && formik.touched.price && <div className="error-message">{formik.errors.price}</div>}
        </div>
        
        <div className='form-group mb-4'>
          <label htmlFor="model_number" className='label-title mb-2 d-block w-100 text-left'>Model Number</label>
          <input 
          type="text"
          name="model_number"
          placeholder="Model Number"
          value={formik.values.model_number}
          onChange={formik.handleChange}
          />
          {formik.errors.model_number && formik.touched.model_number && <div className="error-message">{formik.errors.model_number}</div>}
        </div>

        <div className="action-buttons">
          <button type="submit" className='primary-button'>Add Product</button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default AddProduct;