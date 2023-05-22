import { useState, useEffect } from "react";
import HomePrompt from "../components/Home";
import Parking from "../components/Parking";
import Unparking from "../components/Unparking";
import './Home.css';

function Home() {
  const [page, setPage] = useState(0);
  const [maxRows, maxCols] = [10, 10];
  // Assign entrance points to min and max rows and columns
  const entrance = [
    { name: 'Entrance A', value: 'A', row: 0, column: 1 },
    { name: 'Entrance B', value: 'B', row: maxCols, column: 1 },
    { name: 'Entrance C', value: 'C', row: maxCols, column: 8 },
  ];
  const [parkingSlots, setParkingSlots] = useState([]);

  useEffect(() => {
    // Initialize parking slots as a 2d array (cartesian plane)
    const parkingSlots = Array.from({length: maxRows}, () => Array(maxCols).fill(null));

    for (let row = 0; row < maxRows; row++) {
      for (let column = 0; column < maxCols; column++) {
          if (row > 0 && column > 0 && row < maxRows && column < maxCols) {
              parkingSlots[row][column] = {
                occupied: false,
                size: getRandomParkingSize(),
                row,
                column
              }
          }
      }
    }
    setParkingSlots(parkingSlots);
  }, [maxCols, maxRows]);
  
  const park = (size, entryPoint) =>  {
    let nearest = null;
    let nrow = null;
    let nCol = null;
    let maxDistance = 999;
    let ent = entrance.find(e => e.value === entryPoint);

    // Find shortest parking slot distance
    for (let row = 0; row < maxRows; row++) {
        for (let column = 0; column < maxCols; column++) {
            if (row > 0 && column > 0 && row < maxRows && column < maxCols) {
              let slot = parkingSlots[row][column];

              if (slot && !slot.occupied && size <= slot.size) {
                let distance = Math.sqrt(Math.pow((row - ent.row),2) + Math.pow((column - ent.column),2));
                if (distance < maxDistance) {
                  maxDistance = distance;
                  nearest = slot;
                  nrow = row;
                  nCol = column;
                }
              }
            }
        }
    }

    if (!nearest) {
      return false;
    }

    // Update slot data
    nearest.occupied = true;
    nearest.timeIn = Date.now();

    setParkingSlots(parkingSlots);
    return `[${getSize(nearest.size)}] ${nrow}-${nCol}`;
  };

  const unpark = (row, col) => {
    let slot = parkingSlots[row][col];
    if (!slot || !slot.occupied) {
      return false;
    }
    
    // Compute for parking fee
    const fee = compute(slot.size, slot.timeIn);

    // Clear slot data
    slot.occupied = false;
    slot.timeIn = null;

    setParkingSlots(parkingSlots);
    return fee;
  }

  const compute = (size, time) => {
    let payment = 0;
    let timeDiff = Math.ceil((Date.now() - time) / 1000 / 60 / 60);
    let excessTime = timeDiff % 24;

    // Exceeed 24 hrs - charge 5000 for every 24 hrs
    if (timeDiff > 24) {
      payment += parseInt(timeDiff / 24) * 5000;
    }

    // Flat rate - charge 40 for first 3 hrs
    if (timeDiff < 24) {
      payment += 40;
      excessTime -= 3;
    }

    // Exceeding hours- charge depending on parking size
    if (excessTime > 0) {
      if (size === 0) {
        payment += excessTime * 20; // SP
      }
      else if (size === 1) {
        payment += excessTime * 60; // MP
      }
      else if (size === 2) {
        payment += excessTime * 100; // LP
      }
    }

    return payment;
  }

  // Return random parking size from 0 to 2 [S-0, M-1, L-2]
  const getRandomParkingSize = () => {
    const max = 3;
    return Math.floor(Math.random() * max);
  }

  const getSize = (size) => {
    if (size === 0) {
      return "SP";
    }
    else if (size === 1) {
      return "MP";
    }
    else if (size === 2) {
      return "LP";
    }
  }

  const handleOnPark = ({size, entryPoint}) => {
    const result = park(size, entryPoint);
    if (!result) {
      console.log("Sorry. Currently, there's no available parking space.");
      return;
    }

    console.log(`You successfully parked in slot: ${result}`);
    setPage(0);
  };

  const handleOnUnpark = ({row, column}) => {
    const result = unpark(row, column);
    if (!result) {
      console.log("Car not found!")
      return;
    }

    console.log(`Please pay the amount of: P${result}. Thank you!`);
    setPage(0);
  };

  const cancel = () => {
    setPage(0);
  }

  return (
    <div className="home">
      <div className="container">
          {
              page === 0 && <HomePrompt goToPark={() => setPage(1)} goToUnpark={() => setPage(2)}/>
          }
          { page === 1 && <Parking onPark={handleOnPark} onCancel={cancel}/> }
          { page === 2 && <Unparking slots={parkingSlots} onUnpark={handleOnUnpark} onCancel={cancel}/> }
      </div>
    </div>
  );
}
  
export default Home;