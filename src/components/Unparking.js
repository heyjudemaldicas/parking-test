import { useEffect, useState } from "react";
import './Unparking.css';

function Unparking({slots, onUnpark, onCancel}) {
  const [slotNumber, setSlotNumber] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validate = (slotNumber) => {
      if (!slotNumber) return false;
      let [row, column] = [+slotNumber.split("-")[0], +slotNumber.split("-")[1]];
      let slot = slots[row][column];
  
      return slot && slot.row === row && slot.column === column && slot.occupied ? setIsValid(true) : setIsValid(false);
    };
    validate(slotNumber);
  }, [slotNumber, slots])

  const handleUnpark = () => {
    if (isValid) onUnpark(getSlotRowColumn(slotNumber));
  }

  const getSlotRowColumn = (slotNumber) => {
    return { row: +slotNumber.trim().split("-")[0] , column: +slotNumber.trim().split("-")[1]};
  }

  // const validate = useCallback((slotNumber) => {
  //   if (!slotNumber) return false;
  //   let [row, column] = [+slotNumber.split("-")[0], +slotNumber.split("-")[1]];
  //   let slot = slots[row][column];

  //   return slot && slot.row === row && slot.column === column && slot.occupied ? setIsValid(true) : setIsValid(false);
  // });

    return (
      <div className="unparking">
        <div>You are about to leave. Enter your parking slot number below. [00-00]</div>
        <input type="text" placeholder="Enter slot number [00-00]"
          value={slotNumber}
          onChange={(e) => setSlotNumber(e.target.value)}
        />
        <div className="button-container">
          <button onClick={handleUnpark} disabled={!isValid}>Unpark</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
  
  export default Unparking;
  