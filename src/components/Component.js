import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import './Components.css'; // Additional custom styling if needed


function QuantumCircuitSimulator() {
    const [data, setData] = useState([]);
    const [numQubits, setNumQubits] = useState(1);
    const [qubitStates, setQubitStates] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [probabilities, setProbabilities] = useState([]);
    const [gates, setGates] = useState('');

    const fetchData = (input) => {
        setIsLoading(true);
        fetch(`http://localhost:18080/qpl/${input}`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setProbabilities(calculateProbabilities(data.state));
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    const clearData = () => {
        // open the URL to clear the data
        fetch(`http://localhost:18080/qpl/clear`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                setProbabilities([]);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    const calculateProbabilities = (quantumState) => {
        return quantumState.map(complex => complex.real ** 2 + complex.imag ** 2);
    };

    useEffect(() => {
        if (data && data.state) {
            setProbabilities(calculateProbabilities(data.state));
        }
    }, [data]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const statesInput = qubitStates || Array.from({ length: numQubits }, () => '0').join('-');
        // Ensure the '|' character is included to separate qubit states from gates
        const input = `${numQubits}:${statesInput}:${gates}`;
        clearData();
        fetchData(input);
    };
    

    const formatState = (state, numQubits) => {
        return state.map((complex, index) => {
            const binaryIndex = index.toString(2).padStart(numQubits, '0');
            const realPart = complex.real.toFixed(2);
            const imagPart = complex.imag.toFixed(2);
            return `|${binaryIndex}⟩: ${realPart} + ${imagPart}i`;
        });
    };

    return (
        <Container className="quantum-circuit-simulator my-4">
            <h1>Quantum Playground</h1>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Number of Qubits:</Form.Label>
                            <Form.Control
                                type="number"
                                value={numQubits}
                                onChange={(e) => setNumQubits(e.target.value)}
                                placeholder="Number of Qubits"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Qubit States:</Form.Label>
                            <Form.Control
                                type="text"
                                value={qubitStates}
                                onChange={(e) => setQubitStates(e.target.value)}
                                placeholder="e.g., 0-1 (leave blank for all 0s)"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Quantum Gates:</Form.Label>
                            <Form.Control
                                type="text"
                                value={gates}
                                onChange={(e) => setGates(e.target.value)}
                                placeholder="e.g., H-X (Hadamard on Qubit 0, Pauli-X on Qubit 1)"
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button variant="primary" type="submit" className="mt-3">Simulate</Button>
            </Form>
            {isLoading ? (
                <div className="text-center my-3">
                    <Spinner animation="border" />
                </div>
            ) : data && data.state && (
                <div>
                    <h2 className="mt-4">Quantum State</h2>
                    <ListGroup>
                        {formatState(data.state, numQubits).map((item, index) => (
                            <ListGroup.Item key={index}>{item}</ListGroup.Item>
                        ))}
                    </ListGroup>
                    <h2 className="mt-4">Probabilities</h2>
                    <ListGroup>
                        {probabilities.map((prob, index) => (
                            <ListGroup.Item key={index}>{prob.toFixed(2)}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            )}
        </Container>
    );
}

export default QuantumCircuitSimulator;
