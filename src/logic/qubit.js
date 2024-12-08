import Complex from './Complex';

export class Qubit {
    constructor(alpha = 1, beta = 0) {
        // Default to |0⟩ state
        this.state = [
            new Complex(alpha, 0),
            new Complex(beta, 0)
        ];
        this.normalize();
    }

    normalize() {
        const normalizationFactor = Math.sqrt(
            this.state[0].multiply(this.state[0].conjugate()).real +
            this.state[1].multiply(this.state[1].conjugate()).real
        );

        this.state = this.state.map(amplitude =>
            amplitude.divide(new Complex(normalizationFactor, 0))
        );
    }

    // Apply single-qubit gates
    applyGate(gate) {
        const newState = [
            gate[0][0].multiply(this.state[0]).add(gate[0][1].multiply(this.state[1])),
            gate[1][0].multiply(this.state[0]).add(gate[1][1].multiply(this.state[1]))
        ];
        this.state = newState;
        this.normalize();
    }

    measure() {
        const prob0 = this.state[0].multiply(this.state[0].conjugate()).real;
        const random = Math.random();
        
        if (random < prob0) {
            this.state = [new Complex(1, 0), new Complex(0, 0)];
            return 0;
        } else {
            this.state = [new Complex(0, 0), new Complex(1, 0)];
            return 1;
        }
    }

    toString() {
        return `${this.state[0].toString()}|0⟩ + ${this.state[1].toString()}|1⟩`;
    }
}

const QubitInstance = Qubit;
export default QubitInstance;