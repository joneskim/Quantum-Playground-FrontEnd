import React from 'react';

const GateVisualizer = ({ gate, isControl, isTarget }) => {
  if (!gate && !isControl && !isTarget) {
    return <div className="w-full h-full" />;
  }

  if (isControl) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="w-3 h-3 rounded-full bg-quantum-primary" />
      </div>
    );
  }

  if (isTarget) {
    const TargetSymbol = () => {
      if (gate.name === 'X') {
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-quantum-primary" />
            <div className="absolute">
              <div className="w-8 h-0.5 bg-quantum-primary" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-8 bg-quantum-primary" />
            </div>
          </div>
        );
      }
      if (gate.name === 'Z') {
        return <span className="text-lg font-bold text-quantum-primary">Z</span>;
      }
      return <span className="text-lg font-bold text-quantum-primary">{gate.symbol}</span>;
    };

    return (
      <div className="flex items-center justify-center w-full h-full">
        <TargetSymbol />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full bg-quantum-primary bg-opacity-10 rounded">
      <span className="text-lg font-bold text-quantum-primary">{gate.symbol}</span>
    </div>
  );
};

export default GateVisualizer;
