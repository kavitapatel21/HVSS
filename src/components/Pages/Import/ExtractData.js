import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header"; 
import "../../../assets/scss/import.scss" 
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import TableComponent from "./Table";
import { useDispatch, useSelector } from 'react-redux';
import { formatDataAsync, formatedData } from "../../../features/importFileSlice";
import { useNavigate } from 'react-router-dom';
import Loader from "../../loader";
 
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
        setIsLoading(true);
        await dispatch(formatDataAsync(selectedTables)).finally(() => setIsLoading(false));
    }

    return (
      <div className="d-flex">
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout"> 
                <div className="extract-format">
                    <div className="d-flex">
                        <h2 className="page-title mb-4">Extracted Data</h2>  
                        <button className="primary-button ms-auto mb-3" onClick={formatData}>Format Data</button> 
                    </div>
                </div>
                
                <div className="table-wrapper extract">
                    {isLoading ? (
                        <Loader />
                    ) : (
                    tablesData && tablesData.map((tableData, index) => (
                    <div key={index}>
                        <TableComponent 
                            tableData={tableData} 
                            onSelect={() => handleTableSelect(tableData)}
                            onCancel={() => handleTableCancel(index)}
                        />
                        {index < data.length - 1 && <div className="m-0"></div>}
                    </div>
                    ))
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  };
export default ExtractData; 
 