import Qubit from './Qubit';
import CompositeQubit from './CompositeQubit';
import { QuantumGates } from './QuantumGates';

const parseAndSetup = (circuit, numQubits) => {
    // Initialize qubits
    const qubits = Array(numQubits).fill().map(() => new Qubit());
    const compositeQubit = new CompositeQubit(qubits);

    // If there are no operations, return initial probabilities
    if (!circuit || circuit.length === 0) {
        const numStates = Math.pow(2, numQubits);
        const stateLabels = Array.from({ length: numStates }, (_, i) => 
            i.toString(2).padStart(numQubits, '0')
        );
        
        const probabilities = {};
        probabilities[stateLabels[0]] = 1; // Initial state |0...0⟩
        return probabilities;
    }

    // Apply operations in order
    circuit.forEach(operation => {
        if (operation.type === 'CNOT') {
            compositeQubit.applyCNOT(operation.control, operation.target);
        } else if (operation.type === 'CZ') {
            compositeQubit.applyCZ(operation.control, operation.target);
        } else {
            // Single qubit operations
            switch (operation.type) {
                case 'H':
                    compositeQubit.applyHadamard(operation.qubit);
                    break;
                case 'X':
                    compositeQubit.applyPauliX(operation.qubit);
                    break;
                case 'Y':
                    compositeQubit.applyPauliY(operation.qubit);
                    break;
                case 'Z':
                    compositeQubit.applyPauliZ(operation.qubit);
                    break;
                case 'S':
                    compositeQubit.applyPhase(operation.qubit);
                    break;
                case 'T':
                    compositeQubit.applyT(operation.qubit);
                    break;
                default:
                    console.warn(`Unknown gate type: ${operation.type}`);
            }
        }
    });

    // Calculate probabilities for all possible states
    const numStates = Math.pow(2, numQubits);
    const stateLabels = Array.from({ length: numStates }, (_, i) => 
        i.toString(2).padStart(numQubits, '0')
    );
    
    const probabilities = {};
    for (let i = 0; i < numStates; i++) {
        const probability = compositeQubit.getProbability(i);
        if (probability > 0.001) { // Only include non-zero probabilities
            probabilities[stateLabels[i]] = probability;
        }
    }

    return probabilities;
};

export default parseAndSetup;