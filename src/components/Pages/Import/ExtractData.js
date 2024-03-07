import Sidebar from "../../Layout/Sidebar";
import Header from "../../Layout/Header"; 
import "../../../assets/scss/import.scss" 
import IcoSearch from "../../../assets/images/search_ico.svg";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import { useDrag, useDrop } from "react-dnd"; 
import { Table } from "react-bootstrap";
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import TableComponent from "./Table";
import { useDispatch, useSelector } from 'react-redux';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { formatDataAsync, formatedData } from "../../../features/importFileSlice";
import { useNavigate } from 'react-router-dom';
import SubLoader from "../../inner_loader";
 
const ExtractData = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const getFormatedData = useSelector(formatedData);
    const [isLoading, setIsLoading] = useState(false);

    const { data } = location.state || {};
    const { document_id } = location.state || {};

    const [tablesData, setTablesData] = useState(data);
    const [selectedTables, setSelectedTables] = useState([]);
    const [remainingTables, setRemainingTables] = useState(tablesData);
    const navigate = useNavigate();

    const handleTableSelect = (tableData) => {
        setSelectedTables([...selectedTables, tableData]);
    };

    useEffect(() => {
        if (selectedTables != '') {
            setShowOffcanvas(true);
        } 

        if (getFormatedData && document_id) {
        navigate('/format', { 
            state: {
                formattedData: getFormatedData,
                docId: document_id
            }
            });
        }
        
    }, [selectedTables, getFormatedData]);

    const handleTableCancel = (tableIndex) => {
        const updatedTables = [...remainingTables];
        updatedTables.splice(tableIndex, 1);
        setRemainingTables(updatedTables);
    };

    const formatData = async () => {
        setIsLoading(true);
        await dispatch(formatDataAsync(selectedTables)).finally(() => setIsLoading(false));
    }

    const handleClose = () => {
        setShowOffcanvas(false);
    };

    return (
      <div className="d-flex">
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout"> 
                <h2 className="page-title mb-4">Extracted Data</h2>  
                    <div className="table-wrapper extract">
                        { remainingTables && remainingTables.map((tableData, index) => (
                        <div key={index}>
                            <TableComponent 
                                tableData={tableData} 
                                onSelect={() => handleTableSelect(tableData)}
                                onCancel={() => handleTableCancel(index)}
                            />
                            {index < data.length - 1 && <div className="m-0"></div>}
                        </div>
                        ))}
                    </div> 
            </div>
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Selected Tables</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                {isLoading ? (
                        <SubLoader />
                    ) : 
                    (selectedTables.length > 0) ? (
                    <>
                        {selectedTables.map((tableData, index) => (
                            <>
                                <div className="table-wrapper" key={index}>
                                    <Table striped bordered>
                                    <tbody>
                                        {tableData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                            <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                        ))}
                                    </tbody>
                                    </Table> 
                                </div>
                                <div className="top-divider my-3"></div>
                            </>
                        ))}
                        <button className="primary-button w-100" onClick={formatData}>Format Data</button>
                    </>
                    ) : (
                        <p className="regular-title">No tables selected</p>
                    )}
                </Offcanvas.Body>
            </Offcanvas>
        </div>
      </div>
    );
  };
export default ExtractData; 
 