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
            case 'S':
                return Gate.createSGate();
            case 'T':
                return Gate.createTGate();
            case 'I':
                return Gate.createIdentityGate();
            case 'CNOT':
                return Gate.createCNOTGate();
            case 'CCNOT':
                return Gate.createToffoliGate();
            case 'SWAP':
                return Gate.createSWAPGate();
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
        const hGateMatrix = math.matrix([
            [1/math.sqrt(2), 1/math.sqrt(2)],
            [1/math.sqrt(2), -1/math.sqrt(2)]
        ]);
        return new Gate(hGateMatrix);
    }

    static createSGate() {
        const sGateMatrix = math.matrix([
            [1, 0],
            [0, math.complex(0, 1)]
        ]);
        return new Gate(sGateMatrix);
    }

    static createTGate() {
        const tGateMatrix = math.matrix([
            [1, 0],
            [0, math.exp(math.complex(0, math.PI/4))]
        ]);
        return new Gate(tGateMatrix);
    }

    static createIdentityGate() {
        const iGateMatrix = math.matrix([
            [1, 0],
            [0, 1]
        ]);
        return new Gate(iGateMatrix);
    }

    static createCNOTGate() {
        const cnotMatrix = math.matrix([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1],
            [0, 0, 1, 0]
        ]);
        return new Gate(cnotMatrix);
    }

    static createToffoliGate() {
        const size = 8;
        const matrix = math.zeros([size, size]);
        
        for (let i = 0; i < size; i++) {
            const binary = i.toString(2).padStart(3, '0');
            if (binary[0] === '1' && binary[1] === '1') {
                const flippedBit = binary[2] === '0' ? '1' : '0';
                const newState = parseInt(binary.slice(0, 2) + flippedBit, 2);
                matrix.set([i, newState], 1);
            } else {
                matrix.set([i, i], 1);
            }
        }
        
        return new Gate(matrix);
    }

    static createSWAPGate() {
        const swapMatrix = math.matrix([
            [1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1]
        ]);
        return new Gate(swapMatrix);
    }
}

module.exports = {
    Gate,
};