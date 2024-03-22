import Header from "../../../components/Layout/Header"
import Sidebar from "../../../components/Layout/Sidebar"
import "../../../assets/scss/search.scss";
import IcoSearch from "../../../assets/images/search_ico.svg"
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getCodeDetailsAsync, codedetails, codeError, uploadExcelAsync, responseExcel, 
    responseExcelError, checkImportFile, checkImportFileStatus, dwnldFileAsync, importFileError } from "../../../features/homeSearchSlice";
import SubLoader from "../../inner_loader";
import Table from 'react-bootstrap/Table';
import { toast } from "react-toastify";

const HomeSearch = () => {
    const dispatch = useDispatch();
    const details = useSelector(codedetails);
    const error = useSelector(codeError);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [stopImportCall, setStopImportCall] = useState(false);
    const [fileReady, setFileReady] = useState('');
    const [fileId, setFileId] = useState(0);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const excelResponse = useSelector(responseExcel);
    const excelError = useSelector(responseExcelError);
    const checkFileStatus = useSelector(checkImportFileStatus);
    const importError = useSelector(importFileError);

    let callImport;
    useEffect(() => {
        dispatch(checkImportFile());

        callImport = setInterval(() => {
            dispatch(checkImportFile());
        }, 30000);
        
        if (excelResponse) {
            toast.success(excelResponse.message);
        }

        if (searchQuery != '') {
            setIsLoading(true);
            dispatch(getCodeDetailsAsync(searchQuery))
                .finally(() => setIsLoading(false));
        }
        return () => clearInterval(callImport);
        
    }, [dispatch, searchQuery, excelResponse]);

    useEffect(() => {

        if (excelError) {
          toast.error(excelError);
        }

        if (checkFileStatus) {
          setFileReady(checkFileStatus.status)
          if (checkFileStatus.status == 'Ready') {
            clearInterval(callImport);
            setFileId(checkFileStatus.id);
            setFile(checkFileStatus.output_file);
          } else if (checkFileStatus.status == 'In-progress') {
            toast.success('The File uploding is In-Progress. You will be able to download when it will be ready.')
          }
        }
      }, [excelError, checkFileStatus, importError]);
    

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const alldetails = Object.entries(details && details[0] ? details[0]['code_breakdown'] :  {}).map(([key, value]) => ({ key, value }));
    const uploadExcel = () => {
        fileInputRef.current.click();
    }

    const downloadExcel = () => {
        if(importError) {
            toast.error(importError);
        } else {
            const filename = file.substring(file.lastIndexOf('/') + 1);
            downloadFile(file, filename);
        }
        if (fileReady && fileId != 0) {
            dispatch(dwnldFileAsync(fileId));
            setFileReady('Downloaded');
        }
    }

    const downloadFile = (url, filename) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
      };

    const pdfName = details && details[0] ? details[0].document.name : {};
    
    const handleFileInputChange = (event) => {
        setFileReady('In-progress');
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||  // For .xlsx
                selectedFile.type === 'application/vnd.ms-excel' ||  // For .xls
                selectedFile.type === 'text/csv') { // For .csv
                setIsLoading(true);
                let formData = new FormData();
                formData.append("input_file", selectedFile);
                dispatch(uploadExcelAsync(formData)).finally(() => setIsLoading(false));
                event.target.value = '';
            } else {
                toast.error('Please select a valid file type (Excel or CSV).');
            }
        }
    };

    return (
    <div className="d-flex">  
        <Sidebar />
        <div className="page-wrapper search position-relative">         
            <Header />
            <div className="common-layout">
                <div className="d-flex justify-items-end">
                    <h2 className="page-title mb-4">Search</h2>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                    />
                    <button className="primary-button ms-auto mb-3 me-md-2" onClick={uploadExcel} disabled={fileReady == 'In-progress' || fileReady == 'Ready'}>Upload Excel</button> 
                    <button className="primary-button mb-3" onClick={downloadExcel} disabled={fileReady == 'Downloaded' || fileReady == 'In-progress'}>Downloded Excel</button> 
                </div>
                <div className="table-wrapper py-4">
                    <div className="search-data mx-auto">
                        <div className="table-search px-0">
                            <div className="position-relative">
                                <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                                <input type="text" placeholder="Search" id="search" name="search" value={searchQuery} onChange={handleSearch} />
                            </div>
                        </div>
                        {isLoading ? (
                            <SubLoader />
                        ) : (
                        (searchQuery === '') ? (
                            <div></div>
                        ) : (
                        <>
                        <div className="text-end">
                            <strong>Pdf Name : {pdfName}</strong>
                        </div>
                        <Table striped>
                            
                            <thead>
                                <tr>
                                    <th style={{width: "10%"}}>Code Position</th>
                                    <th style={{width: "30%"}}>Code</th>
                                    <th style={{width: "70%"}}>Description</th> 
                                </tr>
                            </thead>
                            <tbody>
                            {alldetails.length === 0  ? (
                                <tr>
                                    <td colSpan="3" className="text-center">No data found</td>
                                </tr>
                            ) : (
                                alldetails.map((detail, i) => (
                                <tr key={i}>
                                    <td>{detail.value.code_position}</td>
                                    <td>{detail.value.code}</td>
                                    <td>{detail.value.description}</td> 
                                </tr>
                            ))
                            )}
                            </tbody>
                        </Table>
                        </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  };
export default HomeSearch;