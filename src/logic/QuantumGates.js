import Complex from './Complex';

const i = new Complex(0, 1);

export const QuantumGates = {
    // Pauli Gates
    I: [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0)]
    ],
    
    X: [
        [new Complex(0, 0), new Complex(1, 0)],
        [new Complex(1, 0), new Complex(0, 0)]
    ],
    
    Y: [
        [new Complex(0, 0), new Complex(0, -1)],
        [new Complex(0, 1), new Complex(0, 0)]
    ],
    
    Z: [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(-1, 0)]
    ],

    // Hadamard Gate
    H: [
        [new Complex(1/Math.sqrt(2), 0), new Complex(1/Math.sqrt(2), 0)],
        [new Complex(1/Math.sqrt(2), 0), new Complex(-1/Math.sqrt(2), 0)]
    ],

    // Phase Gates
    S: [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 1)]
    ],

    T: [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(Math.cos(Math.PI/4), Math.sin(Math.PI/4))]
    ],

    // Rotation Gates
    Rx: (theta) => [
        [new Complex(Math.cos(theta/2), 0), new Complex(0, -Math.sin(theta/2))],
        [new Complex(0, -Math.sin(theta/2)), new Complex(Math.cos(theta/2), 0)]
    ],

    Ry: (theta) => [
        [new Complex(Math.cos(theta/2), 0), new Complex(-Math.sin(theta/2), 0)],
        [new Complex(Math.sin(theta/2), 0), new Complex(Math.cos(theta/2), 0)]
    ],

    Rz: (theta) => [
        [new Complex(Math.cos(theta/2), -Math.sin(theta/2)), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(Math.cos(theta/2), Math.sin(theta/2))]
    ],

    // Phase Shift Gate
    P: (phi) => [
        [new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), Complex.fromPolar(1, phi)]
    ]
};

export const ControlledGates = {
    CNOT: [
        [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)]
    ],

    CZ: [
        [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(-1, 0)]
    ],

    SWAP: [
        [new Complex(1, 0), new Complex(0, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(1, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(1, 0), new Complex(0, 0), new Complex(0, 0)],
        [new Complex(0, 0), new Complex(0, 0), new Complex(0, 0), new Complex(1, 0)]
    ]
};