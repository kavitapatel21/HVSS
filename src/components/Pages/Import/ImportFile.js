import React from "react";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import "../../../assets/scss/import.scss";
import Upload from "../../../assets/images/Upload.svg"
import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocumentAsync, documentData, getExtractDataAsync, extractedData, extractedStatus } from "../../../features/importFileSlice";
import { useNavigate } from 'react-router-dom';
import SubLoader from "../../inner_loader";
import { listVendorAsync, allVendors } from "../../../features/subcodeSlice";
import { toast } from 'react-toastify';

const ImportFile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedFileName, setSelectedFileName] = useState('');
    const [extractData, setExtractData] = useState(false);
    const docData = useSelector(documentData);
    const tableData = useSelector(extractedData);
    const extractStatus = useSelector(extractedStatus);
    const [isLoading, setIsLoading] = useState(false);
    const getAllVendors = useSelector(allVendors);
    const [selectedVendor, setSelectedVendor] = useState(0);

    const handleVendorClick = (eventKey) => {
        setSelectedVendor(eventKey);
    };
    
    const handleFileChange = (event) => {
        if (selectedVendor != 0) {
            setIsLoading(true);
            const selectedFile = event.target.files[0];
            setSelectedFileName(selectedFile.name);
            let formData = new FormData();

            formData.append("file", selectedFile);
            formData.append('vendor_id', selectedVendor);
            dispatch(uploadDocumentAsync(formData)).finally(() => setIsLoading(false));
            event.target.value = '';
        } else {
            event.target.value = '';
            toast.error('Please Select the Vendor.')
        }
    };

    useEffect(() => {
        dispatch(listVendorAsync());
        if (docData) {
            setExtractData(true);
        }
        if (tableData) {
            navigate('/extract', { state: {data: tableData, document_id:docData.id } });
        }
    }, [docData, extractData, tableData]);

    const getextractData = async () => {
        setIsLoading(true)
        if (extractStatus) {
            await dispatch(getExtractDataAsync(docData.id)).finally(() => setIsLoading(false));
        }   
    }
    
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="page-wrapper search">
                <Header />
                <div className="common-layout">
                    <h2 className="page-title mb-4">Import a File</h2>
                    <div className="dropdown-filter d-md-flex justify-content-end w-100 mb-3">
                            <Dropdown align="start"  onSelect={handleVendorClick}>
                                <Dropdown.Toggle id="dropdown-basic" className="outline-button me-0 me-md-2">
                                    {selectedVendor && selectedVendor != 0 ?
                                    getAllVendors.find(vendor => vendor.id == selectedVendor).name
                                    : 'Select Vendor'
                                    }
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item key="0" eventKey="0" active={selectedVendor == 0}>
                                        Select Vendor
                                    </Dropdown.Item>
                                    {getAllVendors && getAllVendors.map(vendor => (
                                    <Dropdown.Item key={vendor.id} eventKey={vendor.id} active={selectedVendor == vendor.id}>
                                        {vendor.name}
                                    </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    <form>
                        <div className="custom-file-upload">
                            <div className="file-upload-box">
                                <div className="input-box">
                                    <div className="file-information">
                                        <img src={Upload} alt="Upload" /> 
                                        {isLoading ? (
                                            <SubLoader />
                                        ) : (
                                        (selectedFileName) ? (
                                            <p>{selectedFileName}</p>
                                        ) : (
                                            <p></p>
                                        ))}
                                        <p className="regular-title">
                                            Drop file here or <span className="highlight position-relative c-pointer">
                                                <input type="file" name="file" id="file_upload" accept=".pdf" onChange={handleFileChange} />browse</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className="text-end mt-4">
                        { extractData && (
                            <button onClick={getextractData} className="primary-button ms-auto">Extract Data</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ImportFile;