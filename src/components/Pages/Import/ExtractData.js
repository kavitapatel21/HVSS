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
import { useDispatch } from 'react-redux';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';

const ExtractData = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    // const { data } = location.state;
    // console.log(data)
    const data = [
        [['Inhalt', ''], ['Features', '1'], ['Contents', '1'], ['Ordering code', '2'], ['Ordering code', '3'], ['Symbols: 2 spool positions', '4'], ['Symbols: 3 spool positions', '5'], ['Symbols for valves with 2 spool positions', '6'], ['Symbols for valves with 2 spool positions', '7'], ['Symbols for valves with 3 spool positions', '7'], ['Function, section', '8'], ['Pilot oil supply (schematic illustration)', '9'], ['Technical data', ''], ['', '(For application outside these values, please consult us!)'], ['10', ''], ['Technical data', ''], ['(For applications outside these parameters, please con-', ''], ['sult us!)', '11'], ['Switching times', '11'], ['Characteristic curves', ''], ['(measured with HLP46, ϑOil = 40 ±5 °C [104 ±9 °F])', '12'], ['Performance limits', ''], ['(measured with HLP46, ϑOil = 40 ±5 °C [104 ±9 °F])', '12'], ['Dimensions', ''], ['(dimensions in mm [inch])', '13'], ['Dimensions', '14'], ['Switching time adjustment', '15'], ['Project planning information', '15'], ['Further information', '15'], ['Notes', '16']],
        [['– Electro-hydraulic (type WEH)', 'Symbols', '4 … 7'], ['▶ For subplate mounting', 'Function, section', '8'], ['▶ Porting pattern according to 4401-07-07-0-05 and', 'Pilot oil supply (schematic illustration)', '9'], ['NFPAT3.5.1 R2-D07', 'Technical data', '10, 11'], ['▶ Spring centering, spring end position', 'Switching times', '11'], ['▶ Wet-pin DC solenoids', 'Characteristic curves', '12'], ['▶ Electrical connection as individual', 'Performance limits', '12'], ['▶ Manual override', 'Dimensions', '13, 14'], ['▶ Switching time adjustment', 'Switching time adjustment', '15'], ['', 'Project planning information', '15'], ['', 'Further information', '15']],
        [['01', '02\n03\n04\n05\n06\n07\n08\n09\n10\n11\n12\n13\n14\n15\n16\n17', ''], ['4', 'WEH\n16\n7X\n/\n6H\nG24\nN9\nK4\n/\n-910', ''], ['01', '4-way version', '4'], ['Types of actuation', '', ''], ['02', 'Electro-hydraulic', 'WEH'], ['Size', '', ''], ['03', 'NG16', '16'], ['Spool return in the main valve', '', ''], ['04', 'By means of springs', 'no code'], ['05', 'For symbols, see page 4 and 5', ''], ['06', 'Component series 70 … 79 (70 … 79: unchanged installation and connection dimension) – NG16 (from series 72)', '7X'], ['Control spool return in the pilot control valve with 2 spool positions and 2 solenoids', '', ''], ['(only possible with symbols C, D, K, Z and hydraulic control spool return in the main valve)', '', ''], ['07', 'With spring return', 'no code'], ['', 'Only with spool “D” in the main valve', 'OF'], ['Pilot control valve', '', ''], ['08', 'Pilot valve (data sheet 23164)', '6H'], ['09', 'Direct voltage 24 V', 'G24'], ['10', 'With concealed manual override', 'N9'], ['Pilot oil flow', '', ''], ['11', 'External pilot oil supply, external pilot oil return  1)', 'no code'], ['', 'Internal pilot oil supply, external pilot oil return 1; 2)', 'E'], ['', 'Internal pilot oil supply, internal pilot oil return 2)', 'ET'], ['', 'External pilot oil supply, internal pilot oil return 1)', 'T'], ['Switching time adjustment', '', ''], ['12', 'Without switching time adjustment', 'no code'], ['', 'Switching time adjustment as supply control', 'S'], ['', 'Switching time adjustment as discharge control', 'S2'], ['Corrosion resistance (outside)', '', ''], ['13', 'None (valve housing primed)', 'no code'], ['Electrical connection', '', ''], ['14', 'Individual connection', ''], ['', 'Without mating connector; connector DIN EN 175301-803', 'K4 3)']],
        [['', '3/16\nDirectional spool valve | WEH'], ['Ordering code', ''], ['01\n02\n03\n04\n05\n06\n07\n08\n09\n10', '11\n12\n13\n14\n15\n16\n17'], ['4\nWEH\n16\n7X\n/\n6H\nG24\nN9', 'K4\n/\n-910'], ['Throttle insert', ''], ['15\nWithout throttle insert (possible only for external pilot oil supply)', 'no code'], ['Throttle Ø1.0 mm [0.0394 inch]', 'B10'], ['Seal material', ''], ['16\nNBR seals', 'no code'], ['Observe compatibility of seals with hydraulic fluid used. (other seals on request)', ''], ['17\nUp to 280 bar [4061 psi]', '-910'], ['1)  Pilot oil supply X or return Y external:', '2)  Pilot oil supply internal (version "ET" and "E"):'], ['▶ The maximum admissible operating parameters of the pilot', 'With this selection the maximum operating pressure reduces to'], ['control valve must be observed (see data sheet\xa023164).', 'maximum pilot pressure.'], ['▶ Minimum pilot pressure: please observe page 10.', '▶ Minimum pilot pressure: please observe page 10.'], ['▶ Maximum pilot pressure: please observe page 10.', '▶ Maximum pilot pressure: please observe page 10.'], ['', '▶ In order to prevent inadmissibly high pressure peaks, a "B10"'], ['', 'throttle insert has to be provided in port P of the pilot'], ['', 'control valve (see page 9).'], ['', '3)  Mating connectors, separate order, see data sheet 23164'], ['', 'RE 24785, edition: 2019-12, Bosch Rexroth AG']]
        ];
    console.log(data);

    
    

    const [tablesData, setTablesData] = useState(data);
    const [selectedTables, setSelectedTables] = useState([]);
    const [remainingTables, setRemainingTables] = useState(tablesData);

    const handleTableSelect = (tableData) => {
        setSelectedTables([...selectedTables, tableData]);
    };

    useEffect(() => {
        if (selectedTables != '') {
            setShowOffcanvas(true);
        }
    }, [selectedTables]);

    const handleTableCancel = (tableIndex) => {
        const updatedTables = [...remainingTables];
        updatedTables.splice(tableIndex, 1);
        setRemainingTables(updatedTables);
    };

    const formatData = () => {
        console.log(selectedTables);
        // dispatch(formatDataAsync(selectedTables));
    }

    const handleClose = () => {
        setShowOffcanvas(false);
    };

    const handleFormat = () => {
        
    }

    return (
      <div className="d-flex">  
        {/* <Loader /> */}
        <Sidebar />
        <div className="page-wrapper">         
            <Header />
            <div className="common-layout"> 
                <h2 className="page-title mb-4">Extracted Data</h2>  
                    <div className="table-wrapper extract">
                        <div className="table-search">
                            <div className="position-relative">
                                <img src={IcoSearch} className="ico_float left" alt="Search Here" />
                                <input type="text" placeholder="Search" id="search" name="search" />
                            </div>
                        </div>
                        
                        { remainingTables.map((tableData, index) => (
                        <div key={index}>
                            <TableComponent 
                                tableData={tableData} 
                                onSelect={() => handleTableSelect(tableData)}
                                onCancel={() => handleTableCancel(index)}
                            />
                            {index < data.length - 1 && <hr />}
                        </div>
                        ))}
                    </div> 
            </div>
            <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Selected Tables</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    {selectedTables.length > 0 ? (
                    <>
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
                        <button onClick={formatData()}>Format Data</button>
                    </>
                    ) : (
                    <p>No tables selected</p>
                    )}
                </Offcanvas.Body>
                </Offcanvas>
        </div>
      </div>
    );
  };
export default ExtractData; 
 