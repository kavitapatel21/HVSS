import React, { useState } from 'react';
import CancelRecord from "../../../assets/images/close-color.svg"


const TableComponent = ({ tableData, onCancel, onSelect }) => {

  const handleSelect = () => {
    onSelect();
  };

  const handleCancel = () => {
    onCancel();
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
    </div>
    
  );
  };

export default TableComponent;