import '../App.css';
import React, { useState, useEffect } from 'react';
import QuantumCircuitSimulator from './Component';
import CircuitGrid from './CircuitGrid';
import ToolBar from './ToolBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function SimulatorPage() {
  // You can add state and useEffect here if you need to fetch data or perform other actions

  return (
    <div className='container'>
      <ToolBar />
      <CircuitGrid />
      {/* <QuantumCircuitSimulator /> */}
    </div>
  );
}

export default SimulatorPage;

