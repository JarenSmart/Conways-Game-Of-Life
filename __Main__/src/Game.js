import React, { useState } from "react";
import "./App.css";

const numRows = 25;
const numCols = 25;

function Game() {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  });

  return (
    <div className="App">
      <h1>Conway's Game of Life</h1>
      <div>
        {grid.map((rows, rowI) =>
          rows.map((col, colI) => (
            <div
              key={`${rowI}-${colI}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowI][colI] ? "lime" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Game;
