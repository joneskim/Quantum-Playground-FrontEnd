const math = require('mathjs');

class Gate {
    constructor(input) {
        if (typeof input === 'string') {
            this.matrix = Gate.createGate(input).getMatrix();
        } else {
            this.matrix = input;
        }
    }

    getMatrix() {
        return this.matrix;
    }

    static createGate(gateName) {
        switch (gateName) {
            case 'X':
                return Gate.createXGate();
            case 'Y':
                return Gate.createYGate();
            case 'Z':
                return Gate.createZGate();
            case 'H':
                return Gate.createHadamardGate();
            default:
                throw new Error(`Unsupported gate: ${gateName}`);
        }
    }

    static createXGate() {
        const xGateMatrix = math.matrix([
            [0, 1],
            [1, 0]
        ]);
        return new Gate(xGateMatrix);
    }

    static createYGate() {
        const yGateMatrix = math.matrix([
            [0, math.complex(0, -1)],
            [math.complex(0, 1), 0]
        ]);
        return new Gate(yGateMatrix);
    }

    static createZGate() {
        const zGateMatrix = math.matrix([
            [1, 0],
            [0, -1]
        ]);
        return new Gate(zGateMatrix);
    }

    static createHadamardGate() {
        console.log('Creating Hadamard gate');
        const hadamardGateMatrix = math.multiply(1 / math.sqrt(2), math.matrix([
            [1, 1],
            [1, -1]
        ]));
        return new Gate(hadamardGateMatrix);
    }

    static createControlledGate(gate) {
        const controlledGateMatrix = math.matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, gate.getMatrix().get([0, 0]), gate.getMatrix().get([0, 1])],
            [0, 0, gate.getMatrix().get([1, 0]), gate.getMatrix().get([1, 1])]
        ]);
        return new Gate(controlledGateMatrix);
    }

    static createControlledXGate() {
        return Gate.createControlledGate(Gate.createXGate());
    }

    static createControlledYGate() {
        return Gate.createControlledGate(Gate.createYGate());
    }

    static createControlledZGate() {
        return Gate.createControlledGate(Gate.createZGate());
    }

    static createControlledHadamardGate() {
        return Gate.createControlledGate(Gate.createHadamardGate());
    }

    static createControlledControlledGate(gate) {
        const controlledControlledGateMatrix = math.matrix([
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0 ,0 ,0 ,0 ,0 ,0],
            [0, 0, 1, 0, 0, 0, 0, 0],
            [0 ,0 ,0 ,1 ,0 ,0 ,0 ,0],
            [0 ,0 ,0 ,0 ,1 ,0 ,0 ,0],
            [0 ,0 ,0 ,0 ,0 ,1 ,0 ,0],
            [0 ,0 ,0 ,0 ,0 ,0 ,gate.getMatrix().get([0, 0]), gate.getMatrix().get([0, 1])],
            [0 ,0 ,0 ,0 ,0 ,0 ,gate.getMatrix().get([1, 0]), gate.getMatrix().get([1, 1])]
        ]);
        return new Gate(controlledControlledGateMatrix);
    }
}

module.exports = {
    Gate,
};