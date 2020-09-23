import React, { useCallback, useState, useRef } from "react";
import produce from "immer";
import "./Game.css";

// Array of movement operations that a cell can use
const gameOps = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
];

function Game() {
  const numRows = 25;
  const numCols = 25;
  const [gen, setGen] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [speed, setSpeed] = useState(500);

  const createNewGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }

    return rows;
  };

  const [grid, setGrid] = useState(() => {
    return createNewGrid();
  });

  const genRef = useRef();
  genRef.current = gen;

  const runSimRef = useRef(gameRunning);
  runSimRef.current = gameRunning;

  // runs simulation of set grid (random or placed)
  const runSim = useCallback(() => {
    if (!runSimRef.current) {
      return;
    }
    setGen((genRef.current += 1));
    setGrid((v) => {
      return produce(v, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let cellNeighbor = 0;
            gameOps.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                cellNeighbor += v[newI][newJ];
              }
            });

            if (cellNeighbor < 2 || cellNeighbor > 3) {
              gridCopy[i][j] = 0;
            } else if (v[i][j] === 0 && cellNeighbor === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSim, speed);
  }, [speed]);

  return (
    <div className="container">
      <h1 className="game-title">Conway's Game of Life</h1>
      <div className="main-container">
        <div className="game-container">
          <h2>Generation: {gen}</h2>
          <div className="grid-box">
            <div
              className="grid"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numCols}, 20px)`,
              }}
            >
              {grid.map((rows, rowI) =>
                rows.map((col, colI) => (
                  <div
                    className="per-square"
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
                      backgroundColor: grid[rowI][colI]
                        ? "#204664"
                        : "lightgray",
                      border: "solid 1px black",
                    }}
                  />
                ))
              )}
            </div>
          </div>
          <div className="buttons-container">
            <button
              className="btn"
              onClick={() => {
                setGameRunning(!gameRunning);
                if (!gameRunning) {
                  runSimRef.current = true;
                  runSim();
                }
              }}
            >
              {gameRunning ? "Stop" : "Start"}
            </button>
            <button
              className="btn"
              onClick={() => {
                setGen(0);
                const rows = [];
                for (let i = 0; i < numRows; i++) {
                  rows.push(
                    Array.from(Array(numCols), () =>
                      Math.random() > 0.5 ? 1 : 0
                    )
                  );
                }

                setGrid(rows);
              }}
            >
              Randomize
            </button>
            <button
              className="btn"
              onClick={() => {
                setGen(0);
                setGrid(createNewGrid());
              }}
            >
              Erase grid
            </button>
            <select
              className="dropdown"
              onChange={(e) => {
                e.preventDefault();
                setSpeed(e.target.value);
              }}
            >
              <option>select a speed</option>
              <option>2000</option>
              <option>1500</option>
              <option>1000</option>
              <option>750</option>
              <option>600</option>
              <option>350</option>
              <option>100</option>
              <option>10</option>
            </select>
          </div>
        </div>
        <div className="rules-container">
          <h3 className="rules-header">Rules:</h3>
          <ul>
            <li>
              If the cell is alive **and** has 2 or 3 neighbors, then it remains
              alive. Else it dies.
            </li>
            <li>
              If the cell is dead **and** has exactly 3 neighbors, then it comes
              to life. Else if remains dead.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Game;
