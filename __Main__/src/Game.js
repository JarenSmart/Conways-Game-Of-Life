import React, { useState } from "react";
import produce from "immer";
import "./Game.css";

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
    <div className="Game-container">
      <h1 className="Game-title">Conway's Game of Life</h1>
      <div
        style={{
          border: "solid 1px lime",
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, rowI) =>
          rows.map((col, colI) => (
            <div
              key={`${rowI}-${colI}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[rowI][colI] = grid[rowI][colI] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[rowI][colI] ? "lime" : "black",
                border: "solid 1px white",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Game;
