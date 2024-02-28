import React, { useState } from 'react';
import CancelRecord from "../../../assets/images/close-color.svg"
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

const TableComponent = ({ tableData, onCancel, onSelect }) => {

  const handleSelect = () => {
    setSelectedTables([...selectedTables, tableData]);
    setShowOffcanvas(true);
  };

  const handleCancel = () => {
    onCancel();
  };

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedTables, setSelectedTables] = useState([]);
  const handleClose = () => {
    setShowOffcanvas(false);
  };

  const handleShow = () => {
    setShowOffcanvas(true);
  };

  
  return (
    <div className="table-container" style={{ marginBottom: '20px' }}>
      <table>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="button-container">
        <button onClick={handleSelect}>Select</button>
        <img
          src={CancelRecord}
          width={24}
          height={24}
          className="c-pointer"
          alt="Cancel"
          onClick={handleCancel}
        />
      </div>
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Selected Tables</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedTables.map((tableData, index) => (
            <div key={index}>
              <table>
                <tbody>
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
    
  );
  };

export default TableComponent;