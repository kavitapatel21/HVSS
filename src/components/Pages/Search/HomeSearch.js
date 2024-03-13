import Header from "../../../components/Layout/Header"
import Sidebar from "../../../components/Layout/Sidebar"
import "../../../assets/scss/search.scss";
import IcoSearch from "../../../assets/images/search_ico.svg"
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getCodeDetailsAsync, codedetails, codeError, uploadExcelAsync, responseExcel, responseExcelError } from "../../../features/homeSearchSlice";
import SubLoader from "../../inner_loader";
import Table from 'react-bootstrap/Table';
import { toast } from "react-toastify";

const HomeSearch = () => {
    const dispatch = useDispatch();
    const details = useSelector(codedetails);
    const error = useSelector(codeError);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const excelResponse = useSelector(responseExcel);
    const excelError = useSelector(responseExcelError);

    const base64toBlob = (base64String) => {
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    useEffect(() => {
        if (searchQuery != '') {
            setIsLoading(true);
            dispatch(getCodeDetailsAsync(searchQuery))
                .finally(() => setIsLoading(false));
        }
        if (excelResponse) {
            const downloadExcel = () => {
                const excelBlob = base64toBlob(excelResponse);
                const url = URL.createObjectURL(excelBlob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'Export_Code_Specification.xlsx');
                document.body.appendChild(link);
                link.click();
                toast.success("Excel Code Specification File Downloded Successfully!")
            };
    
            // Invoke the download function after a brief delay to ensure the link is fully ready
            const timeout = setTimeout(downloadExcel, 100);
            return () => clearTimeout(timeout);
        }

        if (excelError) {
            toast.error(excelError);
        }
    }, [dispatch, searchQuery, excelResponse, excelError]);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
    };

    const alldetails = Object.entries(details && details[0] ? details[0]['code_breakdown'] :  {}).map(([key, value]) => ({ key, value }));
    const uploadExcel = () => {
        fileInputRef.current.click();
    }
    
    const handleFileInputChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||  // For .xlsx
                selectedFile.type === 'application/vnd.ms-excel' ||  // For .xls
                selectedFile.type === 'text/csv') { // For .csv
                setIsLoading(true);
                let formData = new FormData();
                formData.append("file", selectedFile);
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
                <div className="d-flex">
                    <h2 className="page-title mb-4">Search</h2>
                    <input
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                    />
                    <button className="primary-button ms-auto mb-3" onClick={uploadExcel}>Upload Excel</button> 
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
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  };
export default HomeSearch;