const math = require('mathjs');

class Complex {
  constructor(re, im) {
    this.re = re;
    this.im = im;
  }

  toString() {
    return `${this.re} + ${this.im}i`;
  }
}

class Qubit {
  constructor(input) {
    this.state = math.matrix(input.map(complex => [complex.re, complex.im]));
  }

  getState() {
    const complexArray = math.toArray(this.state);
    return complexArray.map(arr => new Complex(arr[0], arr[1]));
  }

  applyGate(gate) {
    this.state = math.multiply(gate.getMatrix(), this.state);
  }

  printState() {
    const state = this.getState();
    const stateString = state.map(complex => complex.toString());
    console.log(stateString.join(", "));
  }
}

class CompositeQubit {
  constructor(qubits) {
    const stateArray = qubits.map(qubit => math.toArray(qubit.getState()));
    this.state = math.matrix(stateArray);
  }

  getState() {
    const complexArray = math.toArray(this.state);
    return complexArray.map(arr => new Complex(arr[0], arr[1]));
  }

  applyGate(gate) {
    this.state = math.multiply(gate.getMatrix(), this.state);
  }
}
