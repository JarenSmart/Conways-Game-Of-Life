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
                    backgroundColor: grid[rowI][colI] ? "#204664" : "lightgray",
                    border: "solid 1px black",
                  }}
                />
              ))
            )}
          </div>
        </div>
        <div className="rules-container">
          <h3 className="rules-header">Rules:</h3>
          <p>
            The universe of the Game of Life is an infinite, two-dimensional
            orthogonal grid of square cells, each of which is in one of two
            possible states, live or dead, (or populated and unpopulated,
            respectively). Every cell interacts with its eight neighbours, which
            are the cells that are horizontally, vertically, or diagonally
            adjacent. At each step in time, the following transitions occur:
            <ul>
              <li>
                Any live cell with fewer than two live neighbours dies, as if by
                underpopulation.
              </li>
              <li>
                Any live cell with two or three live neighbours lives on to the
                next generation.
              </li>
              <li>
                Any live cell with more than three live neighbours dies, as if
                by overpopulation.
              </li>
              <li>
                Any dead cell with exactly three live neighbours becomes a live
                cell, as if by reproduction.
              </li>
            </ul>
          </p>
          <p>
            These rules, which compare the behavior of the automaton to real
            life, can be condensed into the following:
          </p>
          <ul>
            <li>Any live cell with two or three live neighbours survives.</li>
            <li>
              Any dead cell with three live neighbours becomes a live cell.
            </li>
            <li>
              All other live cells die in the next generation. Similarly, all
              other dead cells stay dead.
            </li>
          </ul>
          <p>
            The initial pattern constitutes the seed of the system. The first
            generation is created by applying the above rules simultaneously to
            every cell in the seed; births and deaths occur simultaneously, and
            the discrete moment at which this happens is sometimes called a
            tick. Each generation is a pure function of the preceding one. The
            rules continue to be applied repeatedly to create further
            generations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Game;
