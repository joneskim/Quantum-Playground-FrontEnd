import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const ToolBar = () => {
  return (
    <div className="container my-4">
      <h2 className="text-center mb-3">Gates</h2>
      <div className="d-flex justify-content-center flex-wrap">
        <GateButton gate="H" title="Hadamard Gate" btnStyle="outline-success" />
        <GateButton gate="X" title="Pauli X Gate" btnStyle="outline-success" />
        <GateButton gate="Y" title="Pauli Y Gate" btnStyle="outline-success" />
        <GateButton gate="Z" title="Pauli Z Gate" btnStyle="outline-success" />
      </div>
    </div>
  );
};

const GateButton = ({ gate, title, btnStyle }) => (
  <button 
    className={`btn btn-${btnStyle} m-2`} 
    draggable 
    onDragStart={e => e.dataTransfer.setData('tool', gate)}
    title={title}
    style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
    {gate}
  </button>
);

export default ToolBar;
