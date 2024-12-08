import Qubit from './Qubit';
import CompositeQubit from './CompositeQubit';
import { QuantumGates } from './QuantumGates';

const parseAndSetup = (submissionData) => {
    // Parse the submission data string format: "numQubits:initialStates:operations"
    const [numQubits, initialStates, operationsString] = submissionData.split(':');
    const numQubitsInt = parseInt(numQubits);

    // Initialize qubits
    const qubits = Array(numQubitsInt).fill().map(() => new Qubit());
    const circuit = new CompositeQubit(qubits);

    // If there are no operations, return initial probabilities
    if (!operationsString) {
        const numStates = Math.pow(2, numQubitsInt);
        const probabilities = Array(numStates).fill(0);
        probabilities[0] = 1; // Initial state |0...0⟩
        return probabilities;
    }

    // Parse and apply operations
    const operations = operationsString
        .slice(1, -1) // Remove outer brackets
        .split(']-[')
        .map(step => step.split('-'));

    operations.forEach(step => {
        step.forEach(operation => {
            // Parse operation string
            if (operation.includes('_')) {
                // Controlled operation
                const [gate, qubits] = operation.split('_');
                const targetQubit = parseInt(gate.slice(1));
                const controlQubit = parseInt(qubits);
                
                switch (gate[0]) {
                    case 'X':
                        circuit.applyCNOT(controlQubit, targetQubit);
                        break;
                    case 'Z':
                        circuit.applyCZ(controlQubit, targetQubit);
                        break;
                }
            } else {
                // Single qubit operation
                const gate = operation.slice(0, -1);
                const qubit = parseInt(operation.slice(-1));
                
                switch (gate) {
                    case 'H':
                        circuit.applyHadamard(qubit);
                        break;
                    case 'X':
                        circuit.applyPauliX(qubit);
                        break;
                    case 'Y':
                        circuit.applyPauliY(qubit);
                        break;
                    case 'Z':
                        circuit.applyPauliZ(qubit);
                        break;
                    case 'S':
                        circuit.applyPhase(qubit);
                        break;
                    case 'T':
                        circuit.applyT(qubit);
                        break;
                }
            }
        });
    });

    // Calculate probabilities for all possible states
    const numStates = Math.pow(2, numQubitsInt);
    const probabilities = Array(numStates).fill(0);
    
    for (let i = 0; i < numStates; i++) {
        probabilities[i] = circuit.getProbability(i);
    }

    return probabilities;
};

export default parseAndSetup;