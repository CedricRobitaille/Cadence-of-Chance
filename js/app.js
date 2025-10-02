

// Slot Machine Initialization








/**==========================================
 * Light flashing system.
 * ==========================================
 */

const lights = [] // Array to hold every light dom element

for (let i = 1; i <= 6; i++) { // adds each light dom element to the lights array
  lights.push(document.getElementById(`light-${i}`))
}


lightFlash(5); // At the start of the game, run 5 seconds of flashing

/**
 * Runs the Light Flashing Cycle for a set duration of time
 * @param {seconds} duration - Duration of the flashing cycle.
 */
function lightFlash(duration) {
  interval = 150; // Flashing speed
  const start = Date.now(); // Records the time the function is initiated.

  const timer = setInterval(() => { // Assigns the interval to the time var (so it can be killed)
    const elapsed = Date.now() - start; // Counts the amount of time that has passed

    lights.forEach((light) => { // Run through each light
      light.classList.toggle("light-on") // Toggles the light to either on or off
    });

    if (elapsed >= duration * 1000) { // Duration passed, closing the loop.
      lights.forEach((light) => { // At the end of the loop, turn on all the lights.
        light.classList.add("light-on")
      })
      clearInterval(timer); // Kills the loop [https://developer.mozilla.org/en-US/docs/Web/API/Window/clearInterval]
      setTimeout(lightCycle(), 2000);
    }
  }, interval); // repeats every 150ms
}


// Function to cycle the blinking lights
let lightState = 0;
function lightCycle() {
  lights.forEach((light) => {
    light.classList.remove("light-on")
  });
  setInterval(() => {
    lightState++;
    if (lightState === 3) {
      lightState = 0;
    }
    lights[lightState].classList.add("light-on")
    lights[lightState + 3].classList.add("light-on")
    if (lightState === 0) {
      lights[2].classList.remove("light-on")
      lights[5].classList.remove("light-on")
    } else {
      lights[lightState - 1].classList.remove("light-on")
      lights[lightState - 1 + 3].classList.remove("light-on")
    }

  }, 1000);
}







/**==========================================
 * Slot Machine Spinning System
 * ==========================================
 */


// Creating cells

const displayColumns = document.querySelectorAll(".display-column");


const gameData = {
  symbols: {
    cherry: {
      image: "images/Cherry.png",
      population: 52,
      value: 4,
    },
    orange: {
      image: "images/Orange.png",
      population: 8,
      value: 4,
    },
    bell: {
      image: "images/Bell.png",
      population: 4,
      value: 8,
    },
    horseShoe: {
      image: "images/HorseShoe.png",
      population: 4,
      value: 8,
    },
    diamond: {
      image: "images/Diamond.png",
      population: 2,
      value: 16,
    },
    seven: {
      image: "images/777.png",
      population: 2,
      value: 16,
    },
    bar: {
      image: "images/BAR.png",
      population: 1,
      value: 32,
    }
  },
  patterns: {
    Jackpot: {
      value: 24,
      design: [   // [Column][Row]
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      verticalMove: 0,
      horizontalMove: 0,
    },

    eye: {
      value: 12,
      design: [
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
        [0, 1, 0],
      ],
      verticalMove: 0,
      horizontalMove: 0,
    },

    arrowUp: {
      value: 6,
      design: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      flip: true, // allows this to be flipped (arrow up / down)
      verticalMove: 0,
      horizontalMove: 0,
    },
    
    arrowDown: {
      value: 6,
      design: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ],
      flip: true, // allows this to be flipped (arrow up / down)
      verticalMove: 0,
      horizontalMove: 0,
    },

    line5: {
      value: 4,
      design: [
        [1],
        [1],
        [1],
        [1],
        [1],
      ],
      verticalMove: 2,
      horizontalMove: 0,
    },

    line4: {
      value: 2,
      design: [
        [1],
        [1],
        [1],
        [1],
      ],
      verticalMove: 2,
      horizontalMove: 1,
    },

    line3: {
      value: 1,
      design: [
        [1],
        [1],
        [1],
      ],
      verticalMove: 2,
      horizontalMove: 2,
    },

    lineVertical: {
      value: 1,
      design: [
        [1, 1, 1],
      ],
      verticalMove: 2,
      horizontalMove: 2,
    },

    diagonalDR: {
      value: 1,
      design: [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      flip: true,
      verticalMove: 0,
      horizontalMove: 2,
    },
    diagonalUR: {
      value: 1,
      design: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
      ],
      flip: true,
      verticalMove: 0,
      horizontalMove: 2,
    },
  },
  luck: 1,
  money: 32,
  spins: 0,
}

const symbols = gameData.symbols;
const patterns = gameData.patterns;
let currentPattern = [];

setWeights(); // Initializes the weights

/**
 * Sets the weights for each symbol based on their population
 * Weights depicts how likely each symbol is to show up.
 */
function setWeights() {
  let weight = 0;

  for (const symbol in symbols) {  // Go through each symbol
    weight += symbols[symbol].population;  // Tally all populations
  }

  weight = 100 / weight; // Divides the weight by 100, this gets a percentage to set the symbol weight to.

  for (const symbol in symbols) { // Go through every symbol
    symbols[symbol].weight = symbols[symbol].population * weight; // Set each weight
  }
}


/**
 * Generates a single random symbol name based off the weights for each symbol.
 * @returns Symbol Name
 */
function randomSymbol() {
  const seedValue = Math.random() * 100;
  let weightTotal = 0;

  for (const symbol in symbols) {
    weightTotal += symbols[symbol].weight;
    if (seedValue <= weightTotal) {
      return symbol;
    }
  }
}

/**
 * Builds a 2d array of random symbols.
 * @param {number} boardSize - The length of each column
 * @returns 2D Array of symbols. [column][row]
 */
function buildBoardArray(boardSize = 3) {
  const boardArray = [];

  if (boardSize < 3) { // Must have a minimum quanitity of tiles
    boardSize = 3;
  }

  for (let column = 0; column < 5; column++) {
    const columnArray = [];
    for (let row = 0; row < boardSize; row++) {
      columnArray.push(randomSymbol());
    }
    boardArray.push(columnArray);
  }
  currentPattern = boardArray
  return boardArray
}


/**
 * Creates and displays the slot-machine display.
 * Randomly generates a 2D array of symbols based on the weights/population of each symbols.
 * @param {number} boardSize - Size of the board (measured by length of columns)
 */
function generateDisplay(boardSize = 3) {
  console.log("Randomizing Board")
  const boardArray = buildBoardArray(boardSize); // Starts by generating a 2D array of symbols
  console.log("Board:", boardArray);

  console.log("Building Display")

  for (let column = 0; column < boardArray.length; column++) {
    for (let row = 0; row < boardArray[column].length; row++) {
      const cell = document.createElement("div");
      cell.classList.add("display-unit");

      const imageLink = gameData.symbols[boardArray[column][row]].image;
      const image = document.createElement("img");
      image.setAttribute("src", imageLink);
      image.classList.add("slot-icon");

      cell.appendChild(image);
      displayColumns[column].appendChild(cell)
    }
  }

  console.log("Display Built")
}

generateDisplay(3) // Generate original display configuration








/**==========================================
 * Slot Machine Scoring System
 * ==========================================
 */


/**Scoring Patterns:
 * 
 * Jackpot
 * [ x x x x x ]
 * [ x x x x x ]
 * [ x x x x x ]
 * 
 * Eye
 * [ o x x x o ]
 * [ x x o x x ]
 * [ o x x x o ]
 * 
 * Up Arrow
 * [ o o x o o ]
 * [ o x o x o ]
 * [ x o o o x ]
 * 
 * Down Arrow
 * [ x o o o x ]
 * [ o x o x o ]
 * [ o o x o o ]
 * 
 * Straight 5
 * [ x x x x x ]
 * 
 * Straight 4
 * [ x x x x ]
 * 
 * Straight 3
 * [ x x x ]
 * 
 * Diagonal Up
 * [ o o x ]
 * [ o x o ]
 * [ x o o ]
 * 
 * Diagonal Down
 * [ x o o ]
 * [ o x o ]
 * [ o o x ]
 */



/**
 * Visually announces to the user which symbols are a part of a pattern
 * @param {string} pattern - Pattern Type
 * @param {number} columnStart -
 * @param {number} rowStart - The row to start the pattern
 */
function patternAlert(pattern, columnStart, rowStart) {
  // Start by setting each cell to .cell-scoring

  console.log(`Location: Col: ${columnStart+1} , Row: ${rowStart+1}`)

  setTimeout(() => {
    // Resets the styling of every cell.
  }, 2000); // 2 second delay
}


/**
 * Grants the user money when a pattern has been rolled.
 * @param {string} pattern - The pattern type identified
 */
function patternScore(pattern, symbol) {
  console.log(" ")
  console.log("You got a")
  console.log(symbol + " " + pattern)
  
}


/**
 * Compares the 2d display array the defined patterns.
 * Once a pattern is confirmed, send to Pattern Alert and Pattern Score
 */
patternChecker()
function patternChecker(pattern, colStart, rowStart, length) {

  down();
  function down() {
    for (let col = 0; col < 5; col++) {
      let symbol = "";
      let count = 1;

      for (let row = 0; row < 3; row++) {
        if (row === 0 && col == 0) {
          symbol = currentPattern[col][row];
        } else if (currentPattern[col][row] === symbol) {
          count++
        } else { // Pattern Broke :(
          count = 1
        }
        symbol = currentPattern[col][row];
      }

      if (count >= 3) {
        patternScore("vertical", symbol)
        patternAlert("line3", col, 0);
      }
      count = 1;

    }
  }

  across();
  function across() {
    for (let row = 0; row < 3; row++) {

      let symbol = "";
      let count = 1;

      for (let col = 0; col < 5; col++) {

        if (row === 0 && col == 0) {
          symbol = currentPattern[col][row];
        } else if (currentPattern[col][row] === symbol) {
          count++
        } else { // Pattern Broke :(
          if (count >= 3) {
            acrosslength(col-count);
          }
          count = 1
        }
        symbol = currentPattern[col][row];

      }
      if (count >= 3) {
        acrosslength();
      }
      count = 1;

      function acrosslength(col = null) {
        if (col != null) {
          if (count === 5) {
            patternScore("line5", symbol)
            patternAlert("line3", col, row)
          } else if (count === 4) {
            patternScore("line4", symbol)
            patternAlert("line4", col, row)
          } else {
            patternScore("line3", symbol)
            patternAlert("line3", col, row)
          }
        } else {
          if (count === 5) {
            patternScore("line5", symbol)
            patternAlert("line3", 0, row)
          } else if (count === 4) {
            patternScore("line4", symbol)
            patternAlert("line4", 1, row)
          } else {
            patternScore("line3", symbol)
            patternAlert("line3", 2, row)
          }
        }
      }
    }
  }

  diagonal();
  function diagonal() {

    let symbol = "";

    // Down Right pattern
    for (let range = 0; range < 3; range++) { // diag is 3 across, need to scan 3 extra lanes
      symbol = currentPattern[range][0] // first elem
      let count = 1;
      for (let cell = 1; cell < 3; cell++) { // each cell
        if (symbol == currentPattern[range + cell][cell] && gameData["patterns"]["diagonalDR"].design[cell][cell] == 1) {
          count++;
        }
      }
      if (count === 3) {
        patternScore("diagonalDR", symbol)
        patternAlert("diagonalDR", range)
      }
    }

    // Up Right Pattern
    for (let range = 0; range < 3; range++) {
      symbol = currentPattern[range][2] // first elem
      let count = 1;
      for (let cell = 1; cell < 3; cell++) { // each cell
        if (symbol == currentPattern[range + cell][2-cell] && gameData["patterns"]["diagonalUR"].design[cell][2-cell] == 1) {
          count++;
        }
      }
      if (count === 3) {
        patternScore("diagonalUR", symbol)
        patternAlert("diagonalUR", range)
      }
    }
  }

  arrows()
  function arrows() {
    const upSymbol = currentPattern[0][2]
    const downSymbol = currentPattern[0][0]
    let valid = true;

    // Up Arrow
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 3; row++) {
        if (currentPattern[col][row] != upSymbol) {
          if (gameData["patterns"]["arrowUp"].design[col][row] == 1) {
            valid = false;
          } 
        }
      }
    }
    if (valid === true) {
      patternScore("arrowUp", upSymbol)
      patternAlert("arrowUp")
    }

    valid = true;
    // Down Arrow
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 3; row++) {
        if (currentPattern[col][row] != downSymbol) {
          if (gameData["patterns"]["arrowDown"].design[col][row] == 1) {
            valid = false;
          }
        }
      }
    }
    if (valid === true) {
      patternScore("arrowDown", downSymbol)
      patternAlert("arrowDown")
    }
  }




}