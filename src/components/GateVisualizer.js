import React from 'react';
import './GateVisualizer.css';

const GateVisualizer = ({ gate, isControl, isTarget }) => {
  if (!gate && !isControl && !isTarget) {
    return <div className="empty-cell" />;
  }

  if (isControl) {
    return (
      <div className="gate-visualizer control">
        <div className="control-point" />
      </div>
    );
  }

  if (isTarget) {
    const TargetSymbol = () => {
      if (gate.name === 'X') {
        return (
          <div className="cnot-target">
            <div className="cnot-circle" />
            <div className="cnot-plus">
              <div className="cnot-line horizontal" />
              <div className="cnot-line vertical" />
            </div>
          </div>
        );
      }
      if (gate.name === 'Z') {
        return <span className="cz-target">Z</span>;
      }
      return <span className="target-symbol">{gate.symbol}</span>;
    };

    return (
      <div className="gate-visualizer target">
        <TargetSymbol />
      </div>
    );
  }

  return (
    <div className="gate-visualizer">
      <span className="gate-symbol">{gate.symbol}</span>
    </div>
  );
};

export default GateVisualizer;
