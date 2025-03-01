import React, { useState, useEffect } from 'react';

function QuantumCircuitSimulator() {
    const [data, setData] = useState([]);
    const [numQubits, setNumQubits] = useState(1);
    const [qubitStates, setQubitStates] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [probabilities, setProbabilities] = useState([]);
    const [gates, setGates] = useState('');

    const fetchData = (input) => {
        setIsLoading(true);
        fetch(`http://localhost:18080/qpl/${input}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setProbabilities(calculateProbabilities(data.state));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    const clearData = () => {
        // open the URL to clear the data
        fetch(`http://localhost:18080/qpl/clear`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setProbabilities([]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    const calculateProbabilities = (state) => {
        if (!state) return [];
        return state.map(complex => Math.pow(complex.real, 2) + Math.pow(complex.imag, 2));
    };

    useEffect(() => {
        if (data && data.state) {
            setProbabilities(calculateProbabilities(data.state));
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const statesInput = qubitStates || Array.from({ length: numQubits }, () => '0').join('-');
        // Ensure the '|' character is included to separate qubit states from gates
        const input = `${numQubits}:${statesInput}:${gates}`;
        clearData();
        fetchData(input);
    };

    const handleClear = () => {
        clearData();
        setData([]);
        setProbabilities([]);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Quantum Circuit Simulator</h2>
                
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-4">
                        <label htmlFor="numQubits" className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Qubits
                        </label>
                        <select 
                            id="numQubits" 
                            value={numQubits} 
                            onChange={(e) => setNumQubits(parseInt(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-quantum-primary"
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="qubitStates" className="block text-sm font-medium text-gray-700 mb-1">
                            Qubit States
                        </label>
                        <input 
                            id="qubitStates" 
                            value={qubitStates} 
                            onChange={(e) => setQubitStates(e.target.value)}
                            placeholder="e.g., 0-1 (leave blank for all 0s)"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-quantum-primary"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="gates" className="block text-sm font-medium text-gray-700 mb-1">
                            Quantum Gates
                        </label>
                        <input 
                            id="gates" 
                            value={gates} 
                            onChange={(e) => setGates(e.target.value)}
                            placeholder="e.g., H-X (Hadamard on Qubit 0, Pauli-X on Qubit 1)"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-quantum-primary"
                        />
                    </div>
                    
                    <div className="flex space-x-2">
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-quantum-primary text-white rounded hover:bg-blue-600 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : 'Simulate'}
                        </button>
                        <button 
                            type="button" 
                            onClick={handleClear}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </form>
                
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-quantum-primary"></div>
                    </div>
                ) : data && data.state && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Results</h3>
                        <div className="bg-gray-50 p-4 rounded border border-gray-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Quantum State</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {data.state.map((complex, index) => (
                                    <div key={index} className="p-2 bg-white rounded shadow-sm">
                                        <span className="font-mono">|{index.toString(2).padStart(numQubits, '0')}⟩: {complex.real.toFixed(4)} + {complex.imag.toFixed(4)}i</span>
                                    </div>
                                ))}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Probabilities</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {probabilities.map((prob, index) => (
                                    <div key={index} className="p-2 bg-white rounded shadow-sm">
                                        <span className="font-mono">|{index.toString(2).padStart(numQubits, '0')}⟩: {prob.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QuantumCircuitSimulator;
