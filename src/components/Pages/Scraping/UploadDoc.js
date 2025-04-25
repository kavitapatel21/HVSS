import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { uploadFileAsync } from "../../../features/scrapingSlice";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import Upload from "../../../assets/images/Upload.svg"
import SubLoader from '../../inner_loader';

const UploadDoc = ({ onClose }) => {
    const dispatch = useDispatch();
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleDragEnter = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||  // For .xlsx
            selectedFile.type === 'application/vnd.ms-excel' ||  // For .xls
            selectedFile.type === 'text/csv') { // For .csv
            setIsLoading(true);
            let formData = new FormData();
            formData.append("file", selectedFile);
            dispatch(uploadFileAsync(formData))
                .finally(() => {
                    setIsLoading(false);
                    onClose();
                });
            event.target.value = '';
            onClose();
          } else {
            toast.error('Please select a valid file type (Excel or CSV).');
          }
        }
    };

    const downloadSampleFile = (type) => {
        const fileUrl = type === 'csv' ? '/docs/product_data_to_import.csv' : '/docs/product_data_to_import.xlsx';
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="popup">
            <div className="popup-inner">
                <form>
                    <div className="custom-file-upload" onDragEnter={handleDragEnter} onDragOver={handleDragOver}
                        onDrop={handleFileInputChange}>
                        <div className="doc-upload-box">
                            <div className="doc-box">
                                <div className="doc-information">
                                    <img src={Upload} alt="Upload" /> 
                                    {isLoading ? (
                                        <SubLoader />
                                    ) : (
                                    <p className="regular-title">
                                        Drop file here or <span className="highlight position-relative c-pointer">
                                            <input type="file" name="file" ref={fileInputRef} id="file_upload" accept=".xlsx, .xls, .csv" onChange={handleFileInputChange} />browse</span>
                                    </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="download-sample mb-4">
                Download Sample 
                <a href="#" className="download-link" onClick={() => downloadSampleFile('csv')}> CSV </a>
                /
                <a href="#" className="download-link" onClick={() => downloadSampleFile('excel')}> Excel </a>
                template to import products
                </div>
            </div>
        </div>
    )

};

export default UploadDoc;