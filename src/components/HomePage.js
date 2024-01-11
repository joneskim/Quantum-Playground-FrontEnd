import React from 'react';
import { Button } from 'react-bootstrap';

const HomePage = () => {
  return (
    <div className="container">
      <header className="text-center my-4">
        <h1>Quantum Circuit Simulator</h1>
      </header>
      <section className="text-center my-4">
        <p>Welcome to the Quantum Circuit Simulator. Explore the fascinating world of quantum computing and simulate quantum circuits in real-time.</p>
        <Button variant="primary" href="/simulator">Launch Simulator</Button>
      </section>
      <footer className="text-center my-4">
        <p>© 2024 Quantum Computing Inc.</p>
      </footer>
    </div>
  );
};

export default HomePage;
