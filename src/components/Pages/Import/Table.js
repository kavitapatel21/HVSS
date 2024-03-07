import React, { useState } from 'react';
import CancelRecord from "../../../assets/images/close-color.svg"
import Table from 'react-bootstrap/Table';

const TableComponent = ({ tableData, onCancel, onSelect }) => {

  const handleSelect = () => {
    onSelect();
  };

  const handleCancel = () => {
    onCancel();
  };
  
  return (
    <div className="table-container extract-table">
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
      <div className="text-right d-flex my-3 mx-3">
        <button className='outline-button ms-auto d-flex align-items-center' onClick={handleSelect}>
          Select
        </button> 
        <span className='vertical-divider d-flex align-items-center justify-content-center' onClick={handleCancel}>
          <img
            src={CancelRecord}
            width={24}
            height={24}
            className="c-pointer"
            alt="Cancel" 
          />
        </span>        
      </div>
    </div>    
  );
  };

export default TableComponent;