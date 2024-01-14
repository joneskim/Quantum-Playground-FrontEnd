const { Qubit, TensoredQubits } = require('./qubit');
const { Gate } = require('./Circuit'); // Adjust the path as needed
const math = require('mathjs');


function parseAndSetup(submissionData) {
    const [numQubitsString, qubitStatesString, gatesString] = submissionData.split(':');
    const numQubits = parseInt(numQubitsString);

    const qubitStates = qubitStatesString.split('-').map(state => parseInt(state));

    const gateOperations = gatesString.split(']-').map(operations => {
        const operationsArray = operations.substring(1).split('-');

        const filteredOperations = operationsArray.filter(operation => operation !== '');

        return filteredOperations.map(operation => {
            const [gateType, qubitIndex] = operation.split('');
            return { gateType, qubitIndex: parseInt(qubitIndex) };
        });
    });


    const qubitArray = Array(numQubits).fill().map(() => new Qubit());
    const compositeQubit = new TensoredQubits(qubitArray);


    for (let i = 0; i < gateOperations.length; i++) {
        const operations = gateOperations[i];

        for (let j = 0; j < operations.length; j++) {
            const { gateType, qubitIndex } = operations[j];
            const gate = Gate.createGate(gateType);

            compositeQubit.applyGate({ gate, qubitIndex, controlQubitIndex: 0 });


        }
;
    }

    const probabilities = [];
    const states = compositeQubit.getState().toArray();
    for (let i = 0; i < states.length; i++) {
        const state = states[i];
        for (let j = 0; j < state.length; j++) {
            const complexNumber = state[j];

            const probability = math.pow(complexNumber.re, 2) + math.pow(complexNumber.im, 2);
            probabilities.push(probability);
        }
        
    }

    console.log(probabilities);


    return probabilities;


}

// const submissionData = '2:0:[Y1]';

// const qubits2 = parseAndSetup(submissionData);

// console.log(qubits2.toString());

module.exports = parseAndSetup;



