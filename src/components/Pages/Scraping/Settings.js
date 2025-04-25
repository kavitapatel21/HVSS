import { useState, useEffect } from 'react';
import { updateFreqAsync, getFreqAsync, frequencyData, updateStatus,
    handleScrapingAsync, setScrapStatus, scrapingStatus, checkScrapStatus, resetState, errorStatusMsg
 } from "../../../features/scrapingSlice";
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown } from "react-bootstrap";
import TimePicker from 'react-time-picker';
import Sidebar from '../../Layout/Sidebar';
import Header from '../../Layout/Header';
import 'react-time-picker/dist/TimePicker.css';
import Loader from '../../loader';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { showConfirmationDialog } from "../../../utils/SweetAlert";

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [scheduleType, setScheduleType] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [websites, setWebsites] = useState([]);
    const [websiteInput, setWebsiteInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const freqDetails = useSelector(frequencyData);
    const updateSettingStatus = useSelector(updateStatus);
    const scrapStatus = useSelector(scrapingStatus);
    const scrapingErrMsg = useSelector(errorStatusMsg);
    const [ localStatus, setLocalStatus ] = useState(localStorage.getItem('scrapingOn'));
    const [ showMsg, setShowMsg ] = useState(null);

    let callImport;
    useEffect(() => {
        dispatch(getFreqAsync()).finally(() => setIsLoading(false));
        dispatch(checkScrapStatus());
    }, [dispatch]);

    useEffect(() => {
        if(updateSettingStatus === true) {
          toast.success('Scraping Settings updated Successfully!')
        }
    }, [updateSettingStatus]);

    useEffect(() => {
        callImport = setInterval(() => {
            dispatch(checkScrapStatus());
        }, 30000);

        return () => clearInterval(callImport);

    }, [dispatch]);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const currentStatus = localStorage.getItem('scrapingOn');
            if (currentStatus !== localStatus) {
                setLocalStatus(currentStatus);
                if (currentStatus === null) {
                    toast.success("Scraping is completed");
                    setShowMsg(null);
                    navigateToResults();
                }
            }
        }, 1000); // Check every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [localStatus, navigate]);

    useEffect(() => {
        if (scrapStatus) {
            setShowMsg('Scrapping is in progress!');
            localStorage.setItem('scrapingOn', 'true');
        } else {
            localStorage.removeItem('scrapingOn');
        }
    }, [scrapStatus]);

    useEffect(() => {
        return () => {
            dispatch(resetState()); // Clear state when the component unmounts
        };
    }, [dispatch]);

    useEffect(() => {
        if (scrapingErrMsg) {
            toast.error(scrapingErrMsg);
        }
    }, [scrapingErrMsg]);

    const validate = values => {
        const errors = {};
        if (!values.schedule_type) {
          errors.schedule_type = 'Schedule Type is Required';
        }
    
        if (values.schedule_type == 'weekly' && values.day_of_week == 'no day') {
          errors.day_of_week = 'Day of Week is required when schedule type is weekly';
        }
    
        if (values.schedule_type == 'monthly' && values.day_of_month == 0) {
          errors.day_of_month = 'Day of Month is required when schedule type is monthly';
        }

        return errors;
    }

    const convertUTCToLocal = (hours, minutes) => {
        const utcDate = getDate(hours, minutes);

        const localDate = new Date(utcDate.getTime());

        const localHours = String(localDate.getHours()).padStart(2, '0');
        const localMinutes = String(localDate.getMinutes()).padStart(2, '0');
        return `${localHours}:${localMinutes}`;
    }

    useEffect(() => {
        if(freqDetails && freqDetails.hour != null && freqDetails.minute != null) {
            const localTime = convertUTCToLocal(freqDetails.hour, freqDetails.minute)
            const [hour, minute] = localTime.split(':');
            formik.setValues({
            ...formik.values,
            hour: hour,
            minute: minute,
        });
        }
    }, [freqDetails])
    
    const formik = useFormik({
        initialValues: freqDetails,
        enableReinitialize: true,
        validate,
        onSubmit: async (values) => {
          try {
            setIsLoading(true);
            const time = `${values.hour}:${values.minute}`;
            const [utcHours, utcMinutes] = convertToUTC(time).split(':');
            const updatedValues = {
                ...values,
                hour: utcHours,
                minute: utcMinutes,
            };
            await dispatch(updateFreqAsync(updatedValues)).finally(() => setIsLoading(false));
          } catch (error) {
            console.error('An error occurred:', error);
          }
        },
    });

    const scheduleTypes = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'daily', label: 'Daily' },
        { value: 'hourly', label: 'Hourly' }
    ];
    
    const weekDays = [
        { value: 'Monday', label: 'Monday' },
        { value: 'Tuesday', label: 'Tuesday' },
        { value: 'Wednesday', label: 'Wednesday' },
        { value: 'Thursday', label: 'Thursday' },
        { value: 'Friday', label: 'Friday' },
        { value: 'Saturday', label: 'Saturday'},
        { value: 'Sunday', label: 'Sunday'},
    ];
    
    const handleTimeChange = (time) => {
        if (time) {
            const [hour, minute] = time.split(':');
            console.log(hour);
            if (hour == 24 && minute == 0) {
                console.log(formik.setFieldError('hour', 'Hour cannot be 24:00'))
                formik.setFieldError('hour', 'Hour cannot be 24:00');
            }
            formik.setFieldValue('hour', parseInt(hour, 10));
            formik.setFieldValue('minute', parseInt(minute, 10));
        }
    };

    const convertToUTC = (time) => {
        const timezoneOffset = new Date().getTimezoneOffset();
        const [hours, minutes] = time.split(':').map(Number);

        const date =  new Date();
        date.setUTCHours(hours);
        date.setUTCMinutes(minutes);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);

        const utcDate = new Date(date.getTime() + timezoneOffset * 60000);

        const utcHours = String(utcDate.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(utcDate.getUTCMinutes()).padStart(2, '0');

        return `${utcHours}:${utcMinutes}`;
    }

    const getDate = (hours, minutes) => {
        const utcDate = new Date();
        utcDate.setUTCHours(hours);
        utcDate.setUTCMinutes(minutes);
        utcDate.setUTCSeconds(0);
        utcDate.setUTCMilliseconds(0);
        return utcDate;
    }

    const handleTypeClick = (eventKey) => {
        setScheduleType(eventKey);
        formik.setFieldValue('schedule_type', eventKey);
    };
    
    const handleDayClick = (eventKey) => {
        setSelectedDay(eventKey);
        formik.setFieldValue('day_of_week', eventKey);
    };

    const handleScraping = () => {
        dispatch(handleScrapingAsync())
        .finally(() => {
            localStorage.setItem('scrapingOn', JSON.stringify(true));
        });
        dispatch(setScrapStatus(true));
        setShowMsg('Scrapping is in progress!');
    }

    const navigateToResults = () => {
        showConfirmationDialog(
          'Are you sure to want to go to results?',
          '',
          'question',
          'Yes, Go To Results!',
          'No, cancel',
          true,
          async () => {
            navigate('/results');
        }
        );
    };

    const handleKeyDown = (event) => {
        if (event.key == 'Enter') {
            event.preventDefault();
            if (websiteInput.trim()) {
                formik.setFieldValue('target_websites', [...formik.values.target_websites, websiteInput]);
                setWebsiteInput('');
            }
        }
    }
    
    const handleRemove = (index) => {
        const updatedWebsites = formik.values.target_websites.filter((_, i) => i !== index);
        formik.setFieldValue('target_websites', updatedWebsites);
    }
    
    return (
        <div className="d-flex">  
        <Sidebar />
        <div className="page-wrapper position-relative">         
          <Header />
          <div className="common-layout">
            <div className="position-relative d-md-flex justify-content-between">
                <h2 className="page-title mb-4">Settings</h2>
                <div className="position-relative d-md-flex">
                    <button className='primary-button ms-auto' onClick={handleScraping} disabled={scrapStatus}>
                    {
                        scrapStatus ? (
                        <>
                            <div className="spinner"></div>
                            Scraping
                        </>
                        ) : (
                        'Scrap Now'
                        )
                    }
                    </button>
                </div>
            </div>
            <div className='position-relative d-md-flex justify-content-end file-status'>{showMsg}</div>
            <div className="table-wrapper py-4 mt-2">
                {isLoading ? (
                    <Loader />
                ) : 
                (  
                <form onSubmit={formik.handleSubmit} className="mx-3">
                    <div className="form-group mb-4">
                        <label htmlFor="schedule_type" className='label-title mb-2 d-block w-100 text-left'>Schedule Type</label>
                        <Dropdown align="start">
                        <Dropdown.Toggle id="dropdown-basic" className="outline-button" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{formik.values.schedule_type ? scheduleTypes.find(type => type.value === formik.values.schedule_type).label : 'Select Schedule Type'}</span>
                            <span className="dropdown-toggle-icon"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
                            {scheduleTypes && scheduleTypes.map(type => (
                            <Dropdown.Item key={type.value} eventKey={type.value} 
                                active={type.value === formik.values.schedule_type} onClick={() => handleTypeClick(type.value)}>
                                {type.label}
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        </Dropdown>
                        {formik.errors.schedule_type && formik.touched.schedule_type && <div className="error-message">{formik.errors.schedule_type}</div>}
                    </div>
                    {formik.values.schedule_type == 'weekly' && (
                    <div className="form-group mb-4">
                        <label htmlFor="day_of_week" className='label-title mb-2 d-block w-100 text-left'>Day of Week</label>
                        <Dropdown align="start">
                        <Dropdown.Toggle id="dropdown-basic" className="outline-button" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{formik.values.day_of_week}</span>
                            <span className="dropdown-toggle-icon"></span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto', width: '100%' }}>
                            <Dropdown.Item key="no day" eventKey="no day" active={selectedDay == 'no day'} onClick={() => handleDayClick('no day')}>
                            Select Week Day
                        </Dropdown.Item>
                            {
                            weekDays && weekDays.map(day => (
                            <Dropdown.Item key={day.value} eventKey={day.value} 
                            active={day.value == formik.values.day_of_week} onClick={() => handleDayClick(day.value)}>
                                {day.label}
                            </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                        </Dropdown>
                        {formik.errors.day_of_week && formik.touched.day_of_week && <div className="error-message">{formik.errors.day_of_week}</div>}
                    </div>
                    )}
                    
                    {formik.values.schedule_type == 'monthly' && (
                    <div className="form-group mb-4">
                        <label htmlFor="day_of_month" className='label-title mb-2 d-block w-100 text-left'>Day of Month</label>
                        <input
                        type="number"
                        name="day_of_month"
                        min="1"
                        max="31"
                        value={formik.values.day_of_month}
                        onChange={formik.handleChange}
                        placeholder="Day of Month"
                        />
                        {formik.errors.day_of_month && formik.touched.day_of_month && <div className="error-message">{formik.errors.day_of_month}</div>}
                    </div>
                    )}
                    <div className="form-group mb-4">
                        <label htmlFor="time" className='label-title mb-2 d-block w-100 text-left'>Select Time (Hours & Minutes)</label>
                        <TimePicker
                            onChange={handleTimeChange}
                            value={`${formik.values.hour}:${formik.values.minute}`}
                            format="HH:mm"
                            disableClock={true}
                        />
                    </div>
                    <div className="form-group mb-4">
                        <label htmlFor="time" className='label-title mb-2 d-block w-100 text-left'>Target Websites</label>
                        <div className="website-input-container">
                        { formik.values.target_websites.map((website, index) => (
                            <div className="website-item" key={index}>
                            <span className="text">{website}</span>
                            <span className="close" onClick={() => handleRemove(index)}>&times;</span>
                            </div>
                        ))}
                        <input type="text" value={websiteInput} onChange={(e) => setWebsiteInput(e.target.value)} onKeyDown={handleKeyDown} className="website-input" placeholder="Add Target Websites" />
                        </div>
                    </div>
                    <button className='primary-button ms-auto' type="submit">Save</button>
                </form>
                )}
            </div>
          </div>
        </div>
        </div>
    )

}

export default Settings;