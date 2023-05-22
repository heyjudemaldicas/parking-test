import { useState } from "react";
import './Parking.css';

function Parking({onPark, onCancel}) {
  const [size, setSize] = useState('');
  const [entryPoint, setEntryPoint] = useState('');

  const handlePark = () => {
    if (size && entryPoint) onPark({size, entryPoint});
  }

    return (
      <div className="parking">
        <div>You are about to park.</div>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option hidden value="">Select car size</option>
          <option value="0">Small</option>
          <option value="1">Medium</option>
          <option value="2">Large</option>
        </select>
        <select value={entryPoint} onChange={(e) => setEntryPoint(e.target.value)}>
          <option hidden value="">Select entry point</option>
          <option value="A">Entrance A</option>
          <option value="B">Entrance B</option>
          <option value="C">Entrance C</option>
        </select>
        <div className="button-container">
          <button onClick={handlePark} disabled={!size || !entryPoint}>Park</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
  
  export default Parking;
  