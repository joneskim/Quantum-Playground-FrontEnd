import Complex from './Complex';
import Qubit from './Qubit';
import { QuantumGates, ControlledGates } from './QuantumGates';

class CompositeQubit {
    constructor(qubits = []) {
        this.qubits = qubits;
        this.state = this.calculateCompositeState();
    }

    calculateCompositeState() {
        if (this.qubits.length === 0) {
            return [];
        }

        // Start with the first qubit's state
        let compositeState = this.qubits[0].state;

        // Perform tensor products with remaining qubits
        for (let i = 1; i < this.qubits.length; i++) {
            compositeState = this.tensorProduct(compositeState, this.qubits[i].state);
        }

        return compositeState;
    }

    tensorProduct(state1, state2) {
        const result = [];
        for (let i = 0; i < state1.length; i++) {
            for (let j = 0; j < state2.length; j++) {
                result.push(state1[i].multiply(state2[j]));
            }
        }
        return result;
    }

    applySingleQubitGate(gate, targetQubit) {
        const numQubits = this.qubits.length;
        const dimension = Math.pow(2, numQubits);
        const newState = new Array(dimension).fill(new Complex(0, 0));

        for (let i = 0; i < dimension; i++) {
            for (let j = 0; j < dimension; j++) {
                const mask = 1 << targetQubit;
                if ((i & ~mask) === (j & ~mask)) {
                    const i_target = (i >> targetQubit) & 1;
                    const j_target = (j >> targetQubit) & 1;
                    newState[i] = newState[i].add(
                        this.state[j].multiply(gate[i_target][j_target])
                    );
                }
            }
        }

        this.state = newState;
    }

    applyControlledGate(gate, controlQubit, targetQubit) {
        if (controlQubit === targetQubit) {
            throw new Error('Control and target qubits must be different');
        }

        const numQubits = this.qubits.length;
        const dimension = Math.pow(2, numQubits);
        const newState = new Array(dimension).fill(new Complex(0, 0));

        for (let i = 0; i < dimension; i++) {
            const controlBit = (i >> controlQubit) & 1;
            if (controlBit === 1) {
                // Apply the gate only when control qubit is |1⟩
                const targetBit = (i >> targetQubit) & 1;
                const newTargetBit = targetBit ^ 1; // Flip the target bit
                const newIndex = i ^ (1 << targetQubit);
                newState[newIndex] = this.state[i];
            } else {
                // Keep the same state when control qubit is |0⟩
                newState[i] = this.state[i];
            }
        }

        this.state = newState;
    }

    measure() {
        const probabilities = this.state.map(amplitude => 
            amplitude.multiply(amplitude.conjugate()).real
        );

        const random = Math.random();
        let cumulativeProb = 0;
        
        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProb += probabilities[i];
            if (random <= cumulativeProb) {
                // Collapse the state
                const newState = new Array(this.state.length).fill(new Complex(0, 0));
                newState[i] = new Complex(1, 0);
                this.state = newState;
                return i;
            }
        }

        return probabilities.length - 1;
    }

    measureQubit(qubitIndex) {
        const numQubits = this.qubits.length;
        if (qubitIndex >= numQubits) {
            throw new Error('Invalid qubit index');
        }

        const prob0 = this.state.reduce((sum, amplitude, i) => {
            if (((i >> qubitIndex) & 1) === 0) {
                return sum + amplitude.multiply(amplitude.conjugate()).real;
            }
            return sum;
        }, 0);

        const random = Math.random();
        const result = random < prob0 ? 0 : 1;

        // Collapse the state
        const newState = new Array(this.state.length).fill(new Complex(0, 0));
        for (let i = 0; i < this.state.length; i++) {
            if (((i >> qubitIndex) & 1) === result) {
                newState[i] = this.state[i];
            }
        }

        // Normalize the new state
        const normFactor = Math.sqrt(newState.reduce((sum, amplitude) => 
            sum + amplitude.multiply(amplitude.conjugate()).real, 0
        ));

        this.state = newState.map(amplitude => 
            amplitude.divide(new Complex(normFactor, 0))
        );

        return result;
    }

    getProbability(state) {
        if (state >= this.state.length) {
            throw new Error('Invalid state index');
        }
        return this.state[state].multiply(this.state[state].conjugate()).real;
    }

    isValid() {
        const sum = this.state.reduce((acc, amplitude) => 
            acc + amplitude.multiply(amplitude.conjugate()).real, 0
        );
        return Math.abs(sum - 1) < 1e-10;
    }

    addQubit(qubit) {
        this.qubits.push(qubit);
        this.state = this.calculateCompositeState();
    }

    removeQubit(index) {
        if (index < 0 || index >= this.qubits.length) {
            throw new Error('Invalid qubit index');
        }
        this.qubits.splice(index, 1);
        this.state = this.calculateCompositeState();
    }

    getNumQubits() {
        return this.qubits.length;
    }

    toString() {
        return this.state.map((amplitude, index) => 
            `${amplitude.toString()}|${index.toString(2).padStart(this.qubits.length, '0')}⟩`
        ).join(' + ');
    }

    // Convenience methods for common gates
    applyHadamard(targetQubit) {
        this.applySingleQubitGate(QuantumGates.H, targetQubit);
    }

    applyPauliX(targetQubit) {
        this.applySingleQubitGate(QuantumGates.X, targetQubit);
    }

    applyPauliY(targetQubit) {
        this.applySingleQubitGate(QuantumGates.Y, targetQubit);
    }

    applyPauliZ(targetQubit) {
        this.applySingleQubitGate(QuantumGates.Z, targetQubit);
    }

    applyPhase(targetQubit) {
        this.applySingleQubitGate(QuantumGates.S, targetQubit);
    }

    applyT(targetQubit) {
        this.applySingleQubitGate(QuantumGates.T, targetQubit);
    }

    applyCNOT(controlQubit, targetQubit) {
        this.applyControlledGate(ControlledGates.CNOT, controlQubit, targetQubit);
    }

    applyCZ(controlQubit, targetQubit) {
        this.applyControlledGate(ControlledGates.CZ, controlQubit, targetQubit);
    }

    applySWAP(qubit1, qubit2) {
        this.applyControlledGate(ControlledGates.SWAP, qubit1, qubit2);
    }
}

export default CompositeQubit;