import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header"; 
import "../../../assets/scss/import.scss" 
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import TableComponent from "./Table";
import { useDispatch, useSelector } from 'react-redux';
import { formatDataAsync, formatedData } from "../../../features/importFileSlice";
import { useNavigate } from 'react-router-dom';
import Loader from "../../loader";
import { toast } from "react-toastify";
import Back from "../../../assets/images/arrow-left-solid.svg"
import { clearData } from "../../../features/importFileSlice";
import Table from 'react-bootstrap/Table';
 
const ExtractData = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const getFormatedData = useSelector(formatedData);
    const [isLoading, setIsLoading] = useState(false);

    const { data } = location.state || {};
    const { document_id } = location.state || {};

    const [tablesData, setTablesData] = useState(data);
    const [selectedTables, setSelectedTables] = useState([]);
    const navigate = useNavigate();

    const handleTableSelect = (tableData) => {
        setSelectedTables([...selectedTables, tableData]);
    };

    useEffect(() => {
        if (getFormatedData && document_id) {
        navigate('/format', { 
            state: {
                formattedData: getFormatedData,
                docId: document_id
            }
            });
        }
        console.log(selectedTables);
    }, [selectedTables, getFormatedData]);

    const handleTableCancel = (tableIndex) => {
        const updatedTables = [...selectedTables];
        updatedTables.splice(tableIndex, 1);
        setSelectedTables(updatedTables);
    };
    
    const formatData = async () => {
        // if (selectedTables.length > 0 ) {
        //     setIsLoading(true);
        //     await dispatch(formatDataAsync(selectedTables)).finally(() => setIsLoading(false));
        // } else {
        //     toast.error('Please select atleast one table to format!')
        // }
        setIsLoading(true);
        await dispatch(formatDataAsync(selectedTables)).finally(() => setIsLoading(false));
    }

    const handleBackClick = () => {
        dispatch(clearData());
    };

    return (
      <div className="d-flex">
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout">
                <div className="extract-format">
                    <div className="back-button mb-2">
                        <Link to="/import" onClick={handleBackClick} className="back-link d-flex align-items-left">
                            <img src={Back} width={18} height={18} className="me-2" alt="Back" />
                            Back
                        </Link>
                    </div>
                    <div className="d-flex align-items-center">
                        <h2 className="page-title mb-0">Extracted Data</h2>  
                        <button className="primary-button ms-auto" onClick={formatData}>Format Data</button> 
                    </div>
                </div>
                
                <div className="table-wrapper extract">
                {isLoading ? (
                    <Loader />
                ) : tablesData && tablesData.length > 0 ? (
                    tablesData.map((tableData, index) => (
                        <div key={index}>
                            <TableComponent 
                                tableData={tableData} 
                                onSelect={() => handleTableSelect(tableData)}
                                onCancel={() => handleTableCancel(index)}
                            />
                            {index < tablesData.length - 1 && <div className="m-0"></div>}
                        </div>
                    ))
                ) : (
                    <div className="d-flex">
                        <Table striped bordered >
                            <tbody>
                                <tr>
                                    <td colSpan="3" className="text-center">No data found. Please go to Format Data and add data manually.</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                )}
                </div>
            </div>
        </div>
      </div>
    );
  };
export default ExtractData; 
 