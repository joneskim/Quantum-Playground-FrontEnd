const math = require('mathjs');

class Qubit {
    constructor(state = math.matrix([
        new math.complex(1, 0),
        new math.complex(0, 0)
        ])) {
        this.state = state;
    }

    applyGate(gate) {
        this.state = math.multiply(gate.getMatrix(), this.state);
    }

    measure() {
        // Measurement logic is not implemented yet
    }

    getState() {
        return this.state;
    }
}

class TensoredQubits extends Qubit {
    constructor(qubits) {
        super();
        this.qubits = qubits;
    }

    tensorProduct(qubits) {
        if (qubits.length === 0) {
            return math.matrix([
                [new math.Complex(1, 0)],
                [new math.Complex(0, 0)]
            ]);
        }
    
        let result = qubits[qubits.length - 1].getState();
        for (let i = qubits.length - 2; i >= 0; i--) {
            result = math.kron(qubits[i].getState(), result);
        }
        
        return result;
    }
    
    getState() {
        return this.tensorProduct(this.qubits);
    }

    applyGate({ gate, qubitIndex, controlQubitIndex }) {
        if (controlQubitIndex == 0) {
            this.qubits[qubitIndex].applyGate(gate);
            console.log(gate.getMatrix().toString(), qubitIndex)
            console.log('Applied gate to qubit', this.qubits[qubitIndex].getState().toString(), 'qubitIndex', qubitIndex);
        }
    }

    measure() {
        // Measurement logic is not implemented yet
    }
}

module.exports = {
    Qubit,
    TensoredQubits
};