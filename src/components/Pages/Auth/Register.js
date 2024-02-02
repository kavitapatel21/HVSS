import { useFormik, ErrorMessage  } from 'formik';
import {Row, Col} from 'react-bootstrap';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import PasswordShow from '../../../assets/images/password-show.svg';
import PasswordHide from '../../../assets/images/password-hide.svg';
import { useState } from 'react';
import AuthService from "../../../services/auth.service";


const validationSchema = Yup.object({
  firstname: Yup.string().required('First name is required'),
  lastname: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export function Register() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { firstname: '', lastname: '', email: '', password: '' },
    validationSchema,
    onSubmit: (values) => {
      const { firstname, lastname, email, password } = values;
      setLoading(true);
  
      AuthService.register(firstname, lastname, email, password).then(
        () => {
        this.props.router.navigate("/");
        window.location.reload();
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        // this.setState({
        //   loading: false,
        //   message: resMessage
        // });
      }
      );
    },
  });  

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
    <div className="container">
      <div className='primary-title text-center text-white'>
        HVSS
      </div>
      <div className="white-box">
        <h1 className="secondary-title mb-5">Create your account</h1>
        <form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={6}>
              <div className='form-group mb-4'>
                <label htmlFor="firstname" className='label-title mb-2 d-block w-100 text-left'>First name</label>
                <input 
                  type="text"
                  name="firstname"
                  placeholder="First Name"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                />
                {formik.errors.firstname && formik.touched.firstname ? (
                  <div className="error-message">{formik.errors.firstname}</div>
                ) : null}
              </div>
            </Col>
            <Col md={6}>
              <div className='form-group mb-4'>
                <label htmlFor="lastname" className='label-title mb-2 d-block w-100 text-left'>Last name</label>
                <input 
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                />
                {formik.errors.lastname && formik.touched.lastname ? (
                  <div className="error-message">{formik.errors.lastname}</div>
                ) : null}
              </div>
            </Col>
            <Col md={12}>
              <div className='form-group mb-4'>
                <label htmlFor="email" className='label-title mb-2 d-block w-100 text-left'>Email</label>
                <input 
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className="error-message">{formik.errors.email}</div>
                ) : null}
              </div>
            </Col>
            <Col md={12}>
              <div className='form-group mb-4'>
                <label htmlFor="password" className='label-title mb-2 d-block w-100 text-left'>Password</label>
                <div className='position-relative'>
                <img
                    src={showPassword ? PasswordHide : PasswordShow}
                    className='ico_float right c-pointer'
                    alt='Password'
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                </div>
                {formik.errors.password && formik.touched.password ? (
                  <div className="error-message">{formik.errors.password}</div>
                ) : null}
              </div> 
            </Col>
          </Row>
          <div className='form-group mb-4'>
            <button type="submit" className='primary-button mx-auto'>
              Create Account
            </button>
          </div>
          <div className='text-center'>
            <span className='regular-title c-pointer'>Already a user? <Link to="/login" className='highlight'>Login</Link></span>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};