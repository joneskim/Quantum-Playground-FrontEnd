import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const QuantumStateHistogram = ({ numQubits, probabilities }) => {
  const labels = Array.from({ length: Math.pow(2, numQubits) }, (_, i) =>
    i.toString(2).padStart(numQubits, '0')
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Probabilities of Output States',
        data: probabilities,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 0.5,
      },
    ],
  };

  const options = {
    scales: { y: { beginAtZero: true } },
    maintainAspectRatio: false,
  };

  // Use a line chart when there are only two probabilities
  if (probabilities.length === 2) {
    return (
      <div style={{ height: '60%', width: '70%' }} className="Histogram">
        <Line data={data} options={options} />
      </div>
    );
  } else {
    return (
      <div style={{ height: '60%', width: '70%' }} className="Histogram">
        <Bar data={data} options={options} />
      </div>
    );
  }
};

export default QuantumStateHistogram;
