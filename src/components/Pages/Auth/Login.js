import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import PasswordShow from '../../../assets/images/password-show.svg';
import PasswordHide from '../../../assets/images/password-hide.svg'
import { useState, useRef, useEffect  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginAsync, selectStatus, getError, selectIsLoggedIn } from "../../../features/loginSlice";
import { toast } from 'react-toastify';

const validate = values => {
  const errors = {};
  if (!values.username) {
    errors.username = 'Username is Required';
  }

  if (!values.password) {
    errors.password = 'Password is Required';
  }

  return errors;
}

export function Login() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  let navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const errorMessage = useSelector(getError);

  useEffect(() => {
    if (isLoggedIn && status == 'succeeded') {
      navigate("/home"); // Redirect to home after successful login
    } else if(status == 'failed') {
      toast.error(errorMessage);
    }
  }, [isLoggedIn, status, navigate, errorMessage]);

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validate,
    onSubmit: values => { dispatch(loginAsync(values)); },
  });

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="container">
        <div className='primary-title text-center text-white'>
          HVSS
        </div>
        <div className="white-box">
          <h1 className="secondary-title mb-5">Login</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className='form-group mb-4'>
              <label htmlFor="username" className='label-title mb-2 d-block w-100 text-left'>Username</label>
              <input 
                type="text"
                name="username"
                placeholder="Username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.errors.username && formik.touched.username && <div className="error-message">{formik.errors.username}</div>}
            </div>
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
                  className="pe-5"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
              </div>
              {formik.errors.password && formik.touched.password && <div className="error-message">{formik.errors.password}</div>}
            </div>
            <div className='text-end mb-4'>
              <span className='regular-title c-pointer'>Forgot password?</span>
            </div>
            <div className='form-group mb-4'>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                name="login"
                id='login'
                className='primary-button mx-auto'
              >
                Login
              </button>
            </div>
            <div className='text-center'>
              <span className='regular-title c-pointer'>New user? <Link to="/register" className='highlight'>Create account</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};