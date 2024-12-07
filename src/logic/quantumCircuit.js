const math = require('mathjs');
const { Gate } = require('./Gates');

// Helper functions for linear algebra
function matMul(A, B) {
    const m = A.length;
    const n = A[0].length;
    const p = B[0].length;
    const C = Array.from({length: m}, () => Array(p).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
            let sum = 0;
            for (let k = 0; k < n; k++) {
                sum += A[i][k] * B[k][j];
            }
            C[i][j] = sum;
        }
    }
    return C;
}

function kronecker(A, B) {
    const m = A.length;
    const n = A[0].length;
    const p = B.length;
    const q = B[0].length;
    const result = Array.from({length: m * p}, () => Array(n * q).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let r = 0; r < p; r++) {
                for (let c = 0; c < q; c++) {
                    result[i*p + r][j*q + c] = A[i][j] * B[r][c];
                }
            }
        }
    }
    return result;
}

// Basic quantum gates
const H = [
    [1/Math.sqrt(2), 1/Math.sqrt(2)],
    [1/Math.sqrt(2), -1/Math.sqrt(2)]
];

const X = [
    [0, 1],
    [1, 0]
];

const I = [
    [1, 0],
    [0, 1]
];

// CNOT matrix in basis |00⟩, |01⟩, |10⟩, |11⟩
const CNOT = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0]
];

class QuantumCircuit {
    constructor(numQubits) {
        this.numQubits = numQubits;
        
        // Initialize state vector to |00...0⟩
        const dimension = Math.pow(2, numQubits);
        this.state = math.zeros(dimension, 1);
        this.state.set([0, 0], math.complex(1, 0));
    }

    // Embed single-qubit gate into n-qubit space
    embedSingleQubitGate(gateMatrix, targetQubit) {
        let result = math.matrix([[math.complex(1, 0)]]);
        const I = math.matrix([[math.complex(1, 0), math.complex(0, 0)], 
                             [math.complex(0, 0), math.complex(1, 0)]]);
        
        // Build full gate matrix using tensor products
        for (let i = 0; i < this.numQubits; i++) {
            if (i === targetQubit) {
                result = math.kron(result, gateMatrix);
            } else {
                result = math.kron(result, I);
            }
        }
        
        return result;
    }

    // Apply gate to circuit
    applyGate(gateName, targetQubit, controlQubit = null) {
        let gate;
        
        if (controlQubit !== null) {
            // Create controlled gate
            if (gateName === 'X' && Math.abs(targetQubit - controlQubit) === 1) {
                // Adjacent CNOT
                gate = Gate.createGate('CNOT', controlQubit, targetQubit);
                this.state = math.multiply(gate.matrix, this.state);
            } else {
                console.warn("Only adjacent CNOT gates are supported");
                return;
            }
        } else {
            // Single qubit gates
            gate = Gate.createGate(gateName);
            const fullGate = this.embedSingleQubitGate(gate.matrix, targetQubit);
            this.state = math.multiply(fullGate, this.state);
        }
    }

    // Get measurement probabilities
    getProbabilities() {
        const probs = [];
        for (let i = 0; i < Math.pow(2, this.numQubits); i++) {
            const amplitude = this.state.get([i, 0]);
            const probability = math.pow(math.abs(amplitude), 2);
            probs.push(probability);
        }
        return probs;
    }
}

module.exports = {
    QuantumCircuit
};