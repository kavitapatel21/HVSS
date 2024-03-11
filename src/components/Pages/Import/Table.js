import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';

const TableComponent = ({ tableData, onCancel, onSelect }) => {

  const [selected, setSelected] = useState(false);
  const handleSelect = () => {
    if (!selected) {
        onSelect();
    } else {
      onCancel();
    }
    setSelected(prevSelected => !prevSelected); // Toggle the selected state
  };
  
  return (
    <div className="table-container extract-table mb-5" onClick={handleSelect}>
      <Table striped bordered className={selected ? 'selected-table' : ''}>
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
  );
  };

export default TableComponent;