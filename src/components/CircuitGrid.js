import React, { useState, useEffect } from 'react';
import QuantumStateHistogram from './QuantumHistrogram';
import GateVisualizer from './GateVisualizer';
import './CircuitGrid.css';

const parseAndSetup = require('../logic/run');

const STORAGE_KEY = 'quantum_circuit_state';

const CircuitGrid = () => {
  const [data, setData] = useState({ numQubits: 2, probabilities: [] });
  const [grid, setGrid] = useState(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
    return Array(2).fill().map(() => Array(5).fill(null));
  });
  const [selectedGate, setSelectedGate] = useState(null);
  const [controlPoint, setControlPoint] = useState(null);

  // Save to local storage whenever grid changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }, [grid]);

  useEffect(() => {
    const handleGateSelected = (event) => {
      setSelectedGate(event.detail);
      setControlPoint(null);
    };

    const handleAlgorithmSelected = (event) => {
      const algorithm = event.detail;
      // Determine required grid size
      const numQubits = Math.max(...algorithm.circuit.map(op => 
        Math.max(op.qubit || 0, op.target || 0, op.control || 0)
      )) + 1;
      const numSteps = algorithm.circuit.length;

      // Create new grid
      const newGrid = Array(numQubits).fill().map(() => Array(numSteps).fill(null));

      // Place gates
      algorithm.circuit.forEach((op, step) => {
        if (op.type === 'CNOT' || op.type === 'CZ') {
          // Place control point
          newGrid[op.control][step] = {
            name: op.type === 'CNOT' ? 'X' : 'Z',
            isControl: true,
            connectedTo: op.target - op.control
          };
          // Place target point
          newGrid[op.target][step] = {
            name: op.type === 'CNOT' ? 'X' : 'Z',
            isTarget: true,
            connectedTo: op.control - op.target
          };
        } else {
          // Place single qubit gate
          newGrid[op.qubit][step] = {
            name: op.type,
            symbol: op.type
          };
        }
      });

      setGrid(newGrid);
      setSelectedGate(null);
      setControlPoint(null);
    };

    window.addEventListener('gateSelected', handleGateSelected);
    window.addEventListener('algorithmSelected', handleAlgorithmSelected);
    return () => {
      window.removeEventListener('gateSelected', handleGateSelected);
      window.removeEventListener('algorithmSelected', handleAlgorithmSelected);
    };
  }, []);

  const handleCellClick = (qubit, step) => {
    if (!selectedGate) return;

    if (selectedGate.controlled) {
      if (!controlPoint) {
        setControlPoint({ qubit, step });
      } else {
        if (qubit !== controlPoint.qubit && step === controlPoint.step) {
          const newGrid = [...grid];
          const distance = qubit - controlPoint.qubit;
          
          // Place control point
          newGrid[controlPoint.qubit] = [...newGrid[controlPoint.qubit]];
          newGrid[controlPoint.qubit][step] = {
            ...selectedGate,
            isControl: true,
            connectedTo: distance
          };
          
          // Place target point
          newGrid[qubit] = [...newGrid[qubit]];
          newGrid[qubit][step] = {
            name: selectedGate.targetGate,
            isTarget: true,
            connectedTo: -distance
          };
          
          setGrid(newGrid);
          setSelectedGate(null);
          setControlPoint(null);
        }
      }
    } else {
      const newGrid = [...grid];
      newGrid[qubit] = [...newGrid[qubit]];
      newGrid[qubit][step] = selectedGate;
      setGrid(newGrid);
      setSelectedGate(null);
    }
  };

  const renderControlLines = () => {
    const lines = [];
    const CELL_SIZE = 60;
    const CELL_GAP = 8; // 0.5rem gap between cells
    
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell?.isControl && cell?.connectedTo) {
          // Account for gaps between cells in x position
          const x = colIndex * (CELL_SIZE + CELL_GAP) + (CELL_SIZE / 2);
          // Y positions just use cell size since rows are fixed height
          const startY = rowIndex * CELL_SIZE + (CELL_SIZE / 2);
          const endY = (rowIndex + cell.connectedTo) * CELL_SIZE + (CELL_SIZE / 2);
          
          lines.push(
            <line
              key={`line-${rowIndex}-${colIndex}`}
              x1={x}
              y1={startY}
              x2={x}
              y2={endY}
              stroke="#333"
              strokeWidth="2"
            />
          );
        }
      });
    });
    return lines;
  };

  const createSubmissionData = () => {
    const qubitStates = Array(grid.length).fill('0').join('-');
    let operationString = '';
    let hasOperations = false;

    for (let i = 0; i < grid[0].length; i++) {
      let operationsInColumn = [];
      let hasColumnOperations = false;

      // First pass: find control-target pairs
      const controlsInColumn = [];
      grid.forEach((row, j) => {
        const cell = row[i];
        if (cell?.isControl) {
          controlsInColumn.push({ qubit: j, connectedTo: cell.connectedTo });
        }
      });

      // Second pass: add operations
      for (let j = 0; j < grid.length; j++) {
        const cell = grid[j][i];
        if (cell) {
          if (!cell.isControl && !cell.isTarget) {
            // Single qubit gates
            operationsInColumn.push(`${cell.name}${j}`);
            hasColumnOperations = true;
          } else if (cell.isTarget) {
            // Skip target cells - they'll be handled with their control
            continue;
          }
        }
      }

      // Add controlled operations
      controlsInColumn.forEach(control => {
        const targetCell = grid[control.qubit + control.connectedTo][i];
        if (targetCell && targetCell.name === 'X') {
          // Format: X{target}_{control} for CNOT gates
          operationsInColumn.push(`X${control.qubit + control.connectedTo}_${control.qubit}`);
          hasColumnOperations = true;
        }
      });

      if (hasColumnOperations) {
        if (hasOperations) {
          operationString += '-';
        }
        operationString += `[${operationsInColumn.join('-')}]`;
        hasOperations = true;
      }
    }

    return `${grid.length}:${qubitStates}:${operationString}`;
  };

  const handleSubmit = () => {
    const submissionData = createSubmissionData();
    console.log("Submitting:", submissionData);
    const response = parseAndSetup(submissionData);
    setData({
      numQubits: grid.length,
      probabilities: response || []
    });
  };

  const handleClear = () => {
    const newGrid = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    setGrid(newGrid);
    setData({ numQubits: grid.length, probabilities: [] });
    setSelectedGate(null);
    setControlPoint(null);
  };

  const addQubit = () => {
    if (grid.length < 8) {
      setGrid(prev => [...prev, Array(prev[0].length).fill(null)]);
    }
  };

  const removeQubit = () => {
    if (grid.length > 2) {
      setGrid(prev => prev.slice(0, -1));
    }
  };

  const addOperation = () => {
    setGrid(prev => prev.map(row => [...row, null]));
  };

  const removeOperation = () => {
    if (grid[0].length > 1) {
      setGrid(prev => prev.map(row => row.slice(0, -1)));
    }
  };

  return (
    <div className="quantum-circuit">
      <div className="circuit-container">
        <div className="circuit-workspace">
          <div className="qubit-labels">
            {grid.map((_, index) => (
              <div key={`label-${index}`} className="qubit-label">Q{index}</div>
            ))}
          </div>
          <div className="circuit-grid">
            <div className="grid-lines">
              {grid.map((row, rowIndex) => (
                <div key={`line-${rowIndex}`} className="qubit-line" />
              ))}
            </div>
            <div className="grid-cells">
              {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="grid-row">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`grid-cell ${selectedGate ? 'selectable' : ''} ${
                        controlPoint?.step === colIndex ? 'control-active' : ''
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      <GateVisualizer
                        gate={cell}
                        isControl={cell?.isControl}
                        isTarget={cell?.isTarget}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <svg className="control-lines" width="100%" height="100%" style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 10}}>
              {renderControlLines()}
            </svg>
          </div>
        </div>
      </div>

      <div className="circuit-controls">
        <button className="control-button" onClick={handleClear}>Clear Circuit</button>
        <button className="control-button" onClick={addQubit}>Add Qubit</button>
        <button className="control-button" onClick={removeQubit}>Remove Qubit</button>
        <button className="control-button" onClick={addOperation}>Add Operation</button>
        <button className="control-button" onClick={removeOperation}>Remove Operation</button>
        <button className="control-button run-button" onClick={handleSubmit}>Run Circuit</button>
      </div>

      {data.probabilities.length > 0 && (
        <div className="results-section">
          <QuantumStateHistogram 
            numQubits={data.numQubits}
            probabilities={data.probabilities} 
          />
        </div>
      )}
    </div>
  );
};

export default CircuitGrid;