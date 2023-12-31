import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const QuantumStateHistogram = ({ numQubits, quantumStates }) => {
  const labels = Array.from({ length: Math.pow(2, numQubits) }, 
    (_, i) => i.toString(2).padStart(numQubits, '0'));

  const probabilities = quantumStates.map(state => 
    Math.pow(state.real, 2) + Math.pow(state.imag, 2));

  const data = {
    labels,
    datasets: [{
      label: 'Probabilities of Output States',
      data: probabilities,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 0.5
    }]
  };

  const options = {
    scales: { y: { beginAtZero: true } },
    maintainAspectRatio: false
  };

  return (
    <div style={{ height: '60%', width: '70%' }} className='Histogram'> {/* Adjusted height */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default QuantumStateHistogram;
