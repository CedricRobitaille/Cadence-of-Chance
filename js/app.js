

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


function randomSymbol() {
  const seedValue = Math.random() * 100;

  let weightTotal = 0;

  for (const symbol in symbols) {
    weightTotal += symbols[symbol].weight;
    if (seedValue <= weightTotal) {
      console.log(symbol);
      return symbols[symbol].image;
    }
  }
}






// displayColumns.forEach((column) => {

//   const cell = document.createElement("div")
//   cell.classList.add("display-unit")

//   const image = document.createElement("img")
//   image.setAttribute("src", `images/${symbol}.png`)
//   image.classList.add("slot-icon")

//   cell.appendChild(image)


//   column.appendChild(cell) // Append child only adds one child to the dom. Meaning, for each new instance, you need a new child source
// })