import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const QuantumStateHistogram = ({ data }) => {
  const { numQubits, probabilities } = data;
  
  if (!probabilities || probabilities.length === 0) {
    return (
      <div className="h-60 w-full flex items-center justify-center text-gray-500">
        Run the circuit to see the quantum state distribution
      </div>
    );
  }

  // Sort probabilities by state for consistent display
  const sortedProbabilities = [...probabilities].sort((a, b) => 
    a.state.localeCompare(b.state)
  );

  const chartData = {
    labels: sortedProbabilities.map(item => item.state),
    datasets: [
      {
        label: 'Probability',
        data: sortedProbabilities.map(item => item.probability),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Probability'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Quantum State'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return `Probability: ${(value * 100).toFixed(1)}%`;
          }
        }
      }
    }
  };

  return (
    <div className="h-60 w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default QuantumStateHistogram;
