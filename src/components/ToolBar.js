import React, { useState } from 'react';

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
      { name: 'CNOT', description: 'Controlled NOT (CNOT)', symbol: '●⊕', controlled: true },
      { name: 'CZ', description: 'Controlled Z (CZ)', symbol: '●Z', controlled: true },
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

  const handleGateClick = (gate) => {
    setSelectedGate(gate);
    
    // Create a custom event to notify other components
    const event = new CustomEvent('gateSelected', { 
      detail: gate,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  const handleAlgorithmClick = (algorithm) => {
    // Create a custom event to notify other components
    const event = new CustomEvent('algorithmSelected', { 
      detail: algorithm,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
    
    // Clear selected gate when an algorithm is selected
    setSelectedGate(null);
  };

  const handleRunCircuit = () => {
    const event = new CustomEvent('runCircuit', {
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
  };

  const handleClearCircuit = () => {
    const event = new CustomEvent('clearCircuit', {
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(event);
    setSelectedGate(null);
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Quantum Toolkit</h2>
      </div>
      
      <div className="space-y-6">
        {Object.entries(gates).map(([category, gateList]) => (
          <div key={category} className="pb-2">
            <h3 className="text-sm font-medium text-gray-600 mb-3 pb-2 border-b border-gray-100">{category}</h3>
            <div className="grid grid-cols-2 gap-2">
              {gateList.map((gate) => (
                <button
                  key={gate.name + (gate.controlled ? '-controlled' : '')}
                  className={`p-2 rounded-md text-center transition-colors ${
                    selectedGate && selectedGate.name === gate.name && selectedGate.controlled === gate.controlled
                      ? 'bg-quantum-primary text-white'
                      : 'bg-white hover:bg-quantum-background border border-gray-200'
                  }`}
                  onClick={() => handleGateClick(gate)}
                  title={gate.description}
                >
                  <div className="text-lg font-bold">{gate.symbol || gate.name}</div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Algorithms</h3>
          <div className="space-y-2">
            {Object.entries(algorithms).map(([category, algoList]) => (
              <div key={category}>
                <h4 className="text-xs text-gray-500 mb-2">{category}</h4>
                {algoList.map((algo) => (
                  <button
                    key={algo.name}
                    className="w-full text-left p-2 rounded-md mb-2 bg-white hover:bg-quantum-background border border-gray-200 transition-colors"
                    onClick={() => handleAlgorithmClick(algo)}
                  >
                    <div className="font-medium text-gray-800">{algo.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{algo.description}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button 
            className="w-full py-2 px-4 bg-quantum-primary text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleRunCircuit}
          >
            Run Circuit
          </button>
          <button 
            className="w-full mt-2 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleClearCircuit}
          >
            Clear Circuit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
