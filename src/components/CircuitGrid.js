import React, { useState } from 'react';
import QuantumStateHistogram from './QuantumHistrogram';

const parseAndSetup = require('../logic/run');

const math = require('mathjs');

const CircuitGrid = () => {
  const [data, setData] = useState([]);
  const [numQubits, setNumQubits] = useState(3); // Default number of qubits
  const [numOperations, setNumOperations] = useState(5); // Default number of operations
  const [grid, setGrid] = useState(Array(numQubits).fill().map(() => Array(numOperations).fill(null)));

  const handleDrop = (rowIndex, colIndex, gate) => {
    const newGrid = [...grid];
    newGrid[rowIndex][colIndex] = gate;
    setGrid(newGrid);
  };

  const addQubit = () => {
    setNumQubits(prev => prev + 1);
    setGrid(prev => [...prev, Array(numOperations).fill(null)]);
  };

  const removeQubit = () => {
    if (numQubits > 1) {
      setNumQubits(prev => prev - 1);
      setGrid(prev => prev.slice(0, -1));
    }
  };

  const addOperation = () => {
    setNumOperations(prev => prev + 1);
    setGrid(prev => prev.map(row => [...row, null]));
  };

  const removeOperation = () => {
    if (numOperations > 1) {
      setNumOperations(prev => prev - 1);
      setGrid(prev => prev.map(row => row.slice(0, -1)));
    }
  };

  const createSubmissionData = () => {
    const qubitStates = Array(numQubits).fill('0').join('-');
  
    let operationString = '';
  
    for (let i = 0; i < numOperations; i++) {
      let operationsInColumn = [];
      for (let j = 0; j < numQubits; j++) {
        if (grid[j][i] !== null) {
          operationsInColumn.push(`${grid[j][i]}${j}`);
        }
      }
  
      if (operationsInColumn.length > 0) {
        operationString += `[${operationsInColumn.join('-')}]`;
        if (i < numOperations - 1) {
          operationString += '-';
        }
      }
    }
    operationString = operationString.replace(/-+$/, '');

    // console.log(`${numQubits}:${qubitStates}:${operationString}`);
  
    return `${numQubits}:${qubitStates}:${operationString}`;
  };
  

  const handleSubmit = () => {
    const submissionData = createSubmissionData();
    const response = parseAndSetup(submissionData);
    setData(response);
    // console.log("response: ", response);

  };
  

  return (

<div>
    <div className="circuit-grid-container">
      

      <div className="circuit-grid mb-3">
<table className="table table-bordered">
  <tbody>
    {grid.map((row, rowIndex) => (
      <tr key={rowIndex}>
        {row.map((cell, colIndex) => (
          <td 
            key={colIndex}
            className={`${cell ? "gate-cell" : ""} gate-cell-filled`} 
            onDrop={e => {
              e.preventDefault();
              const gate = e.dataTransfer.getData('tool');
              handleDrop(rowIndex, colIndex, gate);
            }} 
            onDragOver={e => e.preventDefault()}
            style={{ 
              width: '50px', 
              height: '50px', 
              textAlign: 'center',
              border: 'none' // Removing the border here
            }}
          >
            {cell}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>

    </div>

    <div className="controls d-flex justify-content-around mb-5">
          <button className="btn btn-outline-primary btn-custom mx-1" onClick={addQubit} title="Add a new qubit to the circuit">
            Add Qubit
          </button>
          <button className="btn btn-outline-primary btn-custom mx-1" onClick={removeQubit} disabled={numQubits <= 1} title="Remove the last qubit from the circuit">
            Remove Qubit
          </button>
          <button className="btn btn-outline-primary btn-custom mx-1" onClick={addOperation} title="Add a new operation to the qubit">
            Add Operation
          </button>
          <button className="btn btn-outline-primary btn-custom mx-1" onClick={removeOperation} disabled={numOperations <= 1} title="Remove the last operation from the qubit">
            Remove Operation
          </button>
          <button className="btn btn-outline-primary btn-custom mx-1" onClick={handleSubmit} title="Submit the current configuration">
            Submit
          </button>
    </div>


    </div>

    <div className="result-section mt-4 p-3 border rounded shadow-sm bg-white">
  <h2 className="text-center mb-3">Result</h2>
  <div className="result-content">
    {data.length > 0 ? (
      <QuantumStateHistogram numQubits={numQubits} probabilities={data} />
    ) : (
      <p className="text-center">No data to display</p>
    )
    }

  </div>
</div>

</div>

  );
};

export default CircuitGrid;
 