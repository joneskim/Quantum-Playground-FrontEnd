const math = require('mathjs');

class Gate {
  constructor(name, symbol, matrix, description) {
    this.name = name;
    this.symbol = symbol;
    this.matrix = matrix;
    this.description = description;
  }

  static createGate(type, ...params) {
    switch (type) {
      case 'H': return new HGate();
      case 'X': return new XGate();
      case 'Y': return new YGate();
      case 'Z': return new ZGate();
      case 'S': return new SGate();
      case 'T': return new TGate();
      case 'I': return new IGate();
      case 'CNOT': return new CNOTGate(...params);
      case 'CCNOT': return new ToffoliGate(...params);
      case 'SWAP': return new SWAPGate(...params);
      case 'CZ': return new ControlledZGate(...params);
      case 'CY': return new ControlledYGate(...params);
      case 'CP': return new ControlledPhaseGate(...params);
      default:
        throw new Error(`Unsupported gate: ${type}`);
    }
  }

  static makeControlled(gate, control, target) {
    return {
      name: `C-${gate.name}`,
      symbol: gate.symbol,
      matrix: gate.matrix,
      description: `Controlled ${gate.description}`,
      control,
      target,
      isControlled: true
    };
  }
}

// Single-Qubit Gates
class HGate extends Gate {
  constructor() {
    const matrix = math.multiply(1/math.sqrt(2), [[1, 1], [1, -1]]);
    super('H', 'H', matrix, 'Hadamard Gate - Creates superposition');
  }
}

class XGate extends Gate {
  constructor() {
    super('X', 'X', [[0, 1], [1, 0]], 'Pauli-X Gate - Quantum NOT');
  }
}

class YGate extends Gate {
  constructor() {
    super('Y', 'Y', [[0, -math.i], [math.i, 0]], 'Pauli-Y Gate - Rotation around Y-axis');
  }
}

class ZGate extends Gate {
  constructor() {
    super('Z', 'Z', [[1, 0], [0, -1]], 'Pauli-Z Gate - Phase flip');
  }
}

class SGate extends Gate {
  constructor() {
    super('S', 'S', [[1, 0], [0, math.i]], 'S Gate - π/2 phase rotation');
  }
}

class TGate extends Gate {
  constructor() {
    super('T', 'T', [[1, 0], [0, math.exp(math.multiply(math.i, math.pi/4))]], 'T Gate - π/4 phase rotation');
  }
}

class IGate extends Gate {
  constructor() {
    super('I', 'I', [[1, 0], [0, 1]], 'Identity Gate');
  }
}

// Controlled Gates
class ControlledGate extends Gate {
  constructor(name, symbol, matrix, description, control, target) {
    super(name, symbol, matrix, description);
    this.control = control;
    this.target = target;
    this.isControlled = true;
  }
}

class CNOTGate extends ControlledGate {
  constructor(control, target) {
    const matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]];
    super('CNOT', '●', matrix, 'Controlled NOT Gate', control, target);
  }
}

class ControlledZGate extends ControlledGate {
  constructor(control, target) {
    const matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, -1]];
    super('CZ', '●', matrix, 'Controlled Z Gate', control, target);
  }
}

class ControlledYGate extends ControlledGate {
  constructor(control, target) {
    const matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, -math.i], [0, 0, math.i, 0]];
    super('CY', '●', matrix, 'Controlled Y Gate', control, target);
  }
}

class ControlledPhaseGate extends ControlledGate {
  constructor(control, target, phase = math.pi) {
    const matrix = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, math.exp(math.multiply(math.i, phase))]
    ];
    super('CP', '●', matrix, 'Controlled Phase Gate', control, target);
  }
}

// Multi-Control Gates
class ToffoliGate extends Gate {
  constructor(control1, control2, target) {
    const matrix = math.zeros([8, 8]);
    matrix.forEach((row, i) => {
      matrix[i][i] = 1;
    });
    matrix[6][6] = 0;
    matrix[6][7] = 1;
    matrix[7][6] = 1;
    matrix[7][7] = 0;
    
    super('CCNOT', '●', matrix, 'Toffoli Gate (CCNOT)');
    this.control1 = control1;
    this.control2 = control2;
    this.target = target;
    this.isMultiControlled = true;
  }
}

class SWAPGate extends Gate {
  constructor(qubit1, qubit2) {
    const matrix = [
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1]
    ];
    super('SWAP', '×', matrix, 'SWAP Gate');
    this.qubit1 = qubit1;
    this.qubit2 = qubit2;
    this.isSwap = true;
  }
}

module.exports = {
  Gate,
  H: new HGate(),
  X: new XGate(),
  Y: new YGate(),
  Z: new ZGate(),
  S: new SGate(),
  T: new TGate(),
  I: new IGate(),
  CNOTGate,
  ControlledZGate,
  ControlledYGate,
  ControlledPhaseGate,
  ToffoliGate,
  SWAPGate
};
