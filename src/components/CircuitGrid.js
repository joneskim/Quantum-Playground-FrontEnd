import React, { useState, useEffect, useRef } from 'react';
import QuantumStateHistogram from './QuantumHistrogram';

import parseAndSetup from '../logic/run';

const STORAGE_KEY = 'quantum_circuit_state';

const CircuitGrid = () => {
  const [grid, setGrid] = useState(() => {
    const savedGrid = localStorage.getItem(STORAGE_KEY);
    return savedGrid ? JSON.parse(savedGrid) : Array(3).fill().map(() => Array(5).fill(null));
  });
  
  const [selectedGate, setSelectedGate] = useState(null);
  const [controlPoint, setControlPoint] = useState(null);
  const [data, setData] = useState({ numQubits: 3, probabilities: [] });
  const gridContainerRef = useRef(null);

  // Save grid to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }, [grid]);

  const handleRunCircuit = () => {
    try {
      // Convert grid to circuit format
      const circuit = [];
      
      grid.forEach((row, qubit) => {
        row.forEach((cell, step) => {
          if (cell) {
            if (cell.isControl) {
              // This is a control point for a multi-qubit gate
              const targetQubit = qubit + cell.connectedTo;
              circuit.push({
                type: cell.name,
                control: qubit,
                target: targetQubit,
                step
              });
            } else if (!cell.isTarget) {
              // This is a single-qubit gate
              circuit.push({
                type: cell.name,
                qubit,
                step
              });
            }
            // Skip target points as they're handled with control points
          }
        });
      });
      
      // Sort operations by step
      circuit.sort((a, b) => a.step - b.step);
      
      // Run the circuit and get results
      const results = parseAndSetup(circuit, grid.length);
      
      // Format results for histogram
      const formattedData = Object.entries(results).map(([state, probability]) => ({
        state,
        probability: Math.round(probability * 100) / 100
      }));
      
      setData({
        numQubits: grid.length,
        probabilities: formattedData
      });
    } catch (error) {
      console.error('Error running circuit:', error);
      alert('Error running circuit: ' + error.message);
    }
  };

  const handleClearCircuit = () => {
    const newGrid = Array(grid.length).fill().map(() => Array(grid[0].length).fill(null));
    setGrid(newGrid);
    setSelectedGate(null);
    setControlPoint(null);
    setData({ numQubits: grid.length, probabilities: [] });
  };

  const handleAddQubit = () => {
    if (grid.length < 8) {
      setGrid(prev => [...prev, Array(prev[0].length).fill(null)]);
    }
  };

  const handleRemoveQubit = () => {
    if (grid.length > 2) {
      setGrid(prev => prev.slice(0, -1));
    }
  };

  const handleAddColumn = () => {
    setGrid(prev => prev.map(row => [...row, null]));
  };

  const handleRemoveColumn = () => {
    if (grid[0].length > 1) {
      setGrid(prev => prev.map(row => row.slice(0, -1)));
    }
  };

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
            name: op.type,
            isControl: true,
            connectedTo: op.target - op.control
          };
          // Place target point
          newGrid[op.target][step] = {
            name: op.type,
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
    
    const handleRunCircuitEvent = () => {
      handleRunCircuit();
    };
    
    const handleClearCircuitEvent = () => {
      handleClearCircuit();
    };

    window.addEventListener('gateSelected', handleGateSelected);
    window.addEventListener('algorithmSelected', handleAlgorithmSelected);
    window.addEventListener('runCircuit', handleRunCircuitEvent);
    window.addEventListener('clearCircuit', handleClearCircuitEvent);
    
    return () => {
      window.removeEventListener('gateSelected', handleGateSelected);
      window.removeEventListener('algorithmSelected', handleAlgorithmSelected);
      window.removeEventListener('runCircuit', handleRunCircuitEvent);
      window.removeEventListener('clearCircuit', handleClearCircuitEvent);
    };
  }, []);

  const handleCellClick = (rowIndex, colIndex) => {
    if (!selectedGate) return;

    // Handle controlled gates (like CNOT, CZ)
    if (selectedGate.controlled) {
      if (!controlPoint) {
        // First click sets control point
        setControlPoint({ row: rowIndex, col: colIndex });
      } else {
        // Second click sets target point
        const distance = rowIndex - controlPoint.row;
        
        if (distance !== 0 && controlPoint.col === colIndex) {
          const newGrid = [...grid];
          
          // Set control point
          newGrid[controlPoint.row] = [...newGrid[controlPoint.row]];
          newGrid[controlPoint.row][colIndex] = {
            name: selectedGate.name,
            isControl: true,
            connectedTo: distance
          };
          
          // Set target point
          newGrid[rowIndex] = [...newGrid[rowIndex]];
          newGrid[rowIndex][colIndex] = {
            name: selectedGate.name,
            isTarget: true,
            connectedTo: -distance
          };
          
          setGrid(newGrid);
          setSelectedGate(null);
          setControlPoint(null);
        }
      }
    } else {
      // Handle single-qubit gates
      const newGrid = [...grid];
      newGrid[rowIndex] = [...newGrid[rowIndex]];
      newGrid[rowIndex][colIndex] = selectedGate;
      setGrid(newGrid);
      setSelectedGate(null);
    }
  };

  const renderControlLines = () => {
    if (!gridContainerRef.current) return null;
    
    const lines = [];
    const CELL_SIZE = 60;
    
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell?.isControl && cell?.connectedTo) {
          const cellElements = gridContainerRef.current.querySelectorAll(`.cell-${rowIndex}-${colIndex}, .cell-${rowIndex + cell.connectedTo}-${colIndex}`);
          
          if (cellElements.length === 2) {
            const controlElement = cellElements[0];
            const targetElement = cellElements[1];
            
            const controlRect = controlElement.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();
            
            const gridRect = gridContainerRef.current.getBoundingClientRect();
            
            // Calculate positions relative to the grid container
            const x = controlRect.left + controlRect.width / 2 - gridRect.left;
            const y1 = controlRect.top + controlRect.height / 2 - gridRect.top;
            const y2 = targetRect.top + targetRect.height / 2 - gridRect.top;
            
            lines.push(
              <line
                key={`control-line-${rowIndex}-${colIndex}`}
                x1={x}
                y1={y1}
                x2={x}
                y2={y2}
                stroke="black"
                strokeWidth="2"
              />
            );
          }
        }
      });
    });
    
    return (
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        {lines}
      </svg>
    );
  };

  const renderGate = (gate, rowIndex, colIndex) => {
    if (gate.isControl) {
      return <div className="w-3 h-3 rounded-full bg-black"></div>;
    } else if (gate.isTarget) {
      if (gate.name === 'CNOT') {
        return <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">⊕</div>;
      } else if (gate.name === 'CZ') {
        return <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center">Z</div>;
      }
    } else {
      return (
        <div className="w-8 h-8 rounded-md bg-quantum-primary text-white flex items-center justify-center font-bold">
          {gate.symbol || gate.name}
        </div>
      );
    }
  };

  // Effect to update control lines when grid changes
  useEffect(() => {
    // Force a re-render to update the control lines
    const timer = setTimeout(() => {
      // This is just to trigger a re-render after the DOM has updated
    }, 0);
    return () => clearTimeout(timer);
  }, [grid]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex mb-4">
          <div className="w-16 flex flex-col justify-around pr-4">
            {grid.map((_, rowIndex) => (
              <div key={`qubit-label-${rowIndex}`} className="h-[60px] flex items-center">
                <span className="text-sm font-medium text-gray-700">Q{rowIndex}</span>
              </div>
            ))}
          </div>
          
          <div className="flex-grow relative" ref={gridContainerRef}>
            {/* Grid lines */}
            <div className="absolute inset-0">
              {grid.map((_, rowIndex) => (
                <div 
                  key={`qubit-line-${rowIndex}`} 
                  className="h-[60px] border-b border-gray-300"
                />
              ))}
            </div>
            
            {/* Grid cells */}
            <div className="relative z-10">
              {grid.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex h-[60px]">
                  {row.map((cell, colIndex) => (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`cell-${rowIndex}-${colIndex} w-[60px] h-[60px] border border-gray-200 flex items-center justify-center cursor-pointer transition-colors ${
                        controlPoint && controlPoint.row === rowIndex && controlPoint.col === colIndex
                          ? 'bg-quantum-primary bg-opacity-10'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                    >
                      {cell && renderGate(cell, rowIndex, colIndex)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Control lines */}
            {renderControlLines()}
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <button 
            className="px-4 py-2 bg-quantum-primary text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleRunCircuit}
          >
            Run Circuit
          </button>
          
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              onClick={handleAddQubit}
            >
              Add Qubit
            </button>
            <button 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              onClick={handleAddColumn}
            >
              Add Step
            </button>
            <button 
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              onClick={handleClearCircuit}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      {/* Histogram */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Quantum State</h3>
        <QuantumStateHistogram data={data} />
      </div>
    </div>
  );
};

export default CircuitGrid;