import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

const HomePage = () => {
  return (
    <Container fluid className="p-4">
      <header className="text-center mb-5">
        <h1 className="display-3">Joneskim Kimo</h1>
      </header>

      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <p>Welcome to my portfolio. Here, you'll find a collection of my projects.</p>
        </Col>
      </Row>

      <Row>
        {/* Qubit Playground */}
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Img variant="top" src="path-to-qubit-playground-image.jpg" />
            <Card.Body>
              <Card.Title>Qubit Playground</Card.Title>
              <Card.Text>Explore quantum circuits in an interactive simulator designed to demonstrate the principles of quantum computing.</Card.Text>
              <Button variant="primary" href="/simulator">Explore</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <footer className="text-center mt-5">
        <p>© 2024 Joneskim Kimo</p>
      </footer>
    </Container>
  );
};

export default HomePage;
