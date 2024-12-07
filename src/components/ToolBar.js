import React, { useState } from 'react';
import './ToolBar.css';

const ToolBar = () => {
  const [selectedGate, setSelectedGate] = useState(null);

  const gates = {
    'Single-Qubit Gates': [
      { name: 'H', description: 'Hadamard Gate - Creates superposition', symbol: 'H' },
      { name: 'X', description: 'Pauli-X Gate (NOT)', symbol: 'X' },
      { name: 'Y', description: 'Pauli-Y Gate', symbol: 'Y' },
      { name: 'Z', description: 'Pauli-Z Gate', symbol: 'Z' },
      { name: 'S', description: 'S Gate - π/2 phase rotation', symbol: 'S' },
      { name: 'T', description: 'T Gate - π/4 phase rotation', symbol: 'T' },
      { name: 'I', description: 'Identity Gate', symbol: 'I' },
    ],
    'Controlled Gates': [
      { name: 'X', description: 'Controlled NOT (CNOT)', symbol: '●⊕', controlled: true, targetGate: 'X' },
      { name: 'Z', description: 'Controlled Z (CZ)', symbol: '●Z', controlled: true, targetGate: 'Z' },
    ]
  };

  const algorithms = {
    'Common Algorithms': [
      { 
        name: 'Bell State',
        description: 'Creates a maximally entangled state between two qubits',
        circuit: [
          { type: 'H', qubit: 0 },
          { type: 'CNOT', control: 0, target: 1 }
        ]
      },
      {
        name: 'Quantum Teleportation',
        description: 'Teleports a quantum state from one qubit to another',
        circuit: [
          { type: 'H', qubit: 1 },
          { type: 'CNOT', control: 1, target: 2 },
          { type: 'CNOT', control: 0, target: 1 },
          { type: 'H', qubit: 0 },
        ]
      },
      {
        name: 'Deutsch-Jozsa',
        description: 'Determines if a function is constant or balanced',
        circuit: [
          { type: 'X', qubit: 1 },
          { type: 'H', qubit: 0 },
          { type: 'H', qubit: 1 },
          { type: 'CNOT', control: 0, target: 1 },
          { type: 'H', qubit: 0 },
        ]
      },
      {
        name: 'Grover (2-qubit)',
        description: 'Quantum search algorithm',
        circuit: [
          { type: 'H', qubit: 0 },
          { type: 'H', qubit: 1 },
          { type: 'X', qubit: 0 },
          { type: 'X', qubit: 1 },
          { type: 'H', qubit: 1 },
          { type: 'CNOT', control: 0, target: 1 },
          { type: 'H', qubit: 1 },
          { type: 'X', qubit: 0 },
          { type: 'X', qubit: 1 },
          { type: 'H', qubit: 0 },
          { type: 'H', qubit: 1 },
        ]
      }
    ]
  };

  const handleGateClick = (gateInfo) => {
    setSelectedGate(gateInfo);
    const event = new CustomEvent('gateSelected', {
      detail: gateInfo,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  const handleAlgorithmClick = (algorithm) => {
    // Dispatch event to load the algorithm circuit
    const event = new CustomEvent('algorithmSelected', {
      detail: algorithm,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="toolbar">
      <div className="toolbar-header">
        <h2>Quantum Gates & Algorithms</h2>
      </div>
      
      <div className="gates-container">
        {Object.entries(gates).map(([category, gateList]) => (
          <div key={category} className="gate-category">
            <h3>{category}</h3>
            <div className="gate-grid">
              {gateList.map((gateInfo) => (
                <button
                  key={gateInfo.name + (gateInfo.controlled ? '-controlled' : '')}
                  className={`gate-button ${selectedGate?.name === gateInfo.name && selectedGate?.controlled === gateInfo.controlled ? 'selected' : ''}`}
                  onClick={() => handleGateClick(gateInfo)}
                  title={gateInfo.description}
                >
                  <span className="gate-symbol">{gateInfo.symbol}</span>
                  <span className="gate-name">{gateInfo.controlled ? (gateInfo.name === 'X' ? 'CNOT' : 'CZ') : gateInfo.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {Object.entries(algorithms).map(([category, algorithmList]) => (
          <div key={category} className="algorithm-category">
            <h3>{category}</h3>
            <div className="algorithm-grid">
              {algorithmList.map((algorithm) => (
                <button
                  key={algorithm.name}
                  className="algorithm-button"
                  onClick={() => handleAlgorithmClick(algorithm)}
                  title={algorithm.description}
                >
                  <span className="algorithm-name">{algorithm.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ToolBar;
