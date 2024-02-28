import React from "react";
import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header";
import "../../../assets/scss/import.scss";
import Upload from "../../../assets/images/Upload.svg"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocumentAsync, documentData, getExtractDataAsync, extractedData, extractedStatus } from "../../../features/importFileSlice";
import { useNavigate } from 'react-router-dom';
import SubLoader from "../../inner_loader";

const ImportFile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedFileName, setSelectedFileName] = useState('');
    const [extractData, setExtractData] = useState(false);
    const docData = useSelector(documentData);
    const tableData = useSelector(extractedData);
    const extractStatus = useSelector(extractedStatus);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleFileChange = (event) => {
        setIsLoading(true);
        const selectedFile = event.target.files[0];
        setSelectedFileName(selectedFile.name);
        let formData = new FormData();

        formData.append("file", selectedFile);
        dispatch(uploadDocumentAsync(formData)).finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (docData) {
            setExtractData(true);
        }
        if (tableData) {
            navigate('/extract', { state: {data: tableData} });
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