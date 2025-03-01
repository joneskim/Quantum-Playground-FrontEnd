import React, { useState, useEffect } from 'react';
import QuantumCircuitSimulator from './Component';
import CircuitGrid from './CircuitGrid';
import ToolBar from './ToolBar';

function SimulatorPage() {
  // You can add state and useEffect here if you need to fetch data or perform other actions

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      <div className="h-full border-r border-gray-200 bg-white">
        <ToolBar />
      </div>
      <div className="p-4 bg-gray-50">
        <CircuitGrid />
      </div>
    </div>
  );
}

export default SimulatorPage;
