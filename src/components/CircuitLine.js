import { useDrop } from 'react-dnd';

const CircuitLine = ({ qubitIndex, onDropGate }) => {
    const [, drop] = useDrop(() => ({
        accept: 'gate',
        drop: (item, monitor) => onDropGate(item.name, qubitIndex),
    }));

    return (
        <div ref={drop} style={{ minHeight: '50px', border: '1px solid black' }}>
            Qubit {qubitIndex}
            {/* Display gates here */}
        </div>
    );
};

export default CircuitLine;