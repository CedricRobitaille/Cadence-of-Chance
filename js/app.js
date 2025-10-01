

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
function lightCycle () {
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
      population: 8,
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

}

const symbols = gameData.symbols;

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

generateDisplay(3) // Generate display by default





// displayColumns.forEach((column) => {

//   const cell = document.createElement("div")
//   cell.classList.add("display-unit")

//   const image = document.createElement("img")
//   image.setAttribute("src", `images/${symbol}.png`)
//   image.classList.add("slot-icon")

//   cell.appendChild(image)


//   column.appendChild(cell) // Append child only adds one child to the dom. Meaning, for each new instance, you need a new child source
// })