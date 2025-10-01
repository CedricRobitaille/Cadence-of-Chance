

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
  let lightOffset = false; // Var to track on/off lights

  const timer = setInterval(() => { // Assigns the interval to the time var (so it can be killed)
    const elapsed = Date.now() - start; // Counts the amount of time that has passed
    lightOffset = !lightOffset; // Flips the light state tracker

    lights.forEach((light, index) => { // Run through each light
      if (lightOffset) {  // Ensures the current state is different than the last
        if (index % 2 === 0) {  // On even lights >
          light.classList.remove("light-on"); // Turn off the light
        } else {  // On odd lights >
          light.classList.add("light-on") // Turn on the light
        }
      } else {
        if (index % 2 != 0) { // On odd lights >
          light.classList.remove("light-on"); // Turn off the light
        } else {  // On even lights >
          light.classList.add("light-on"); // Turn on the light
        }
      }
    });

    if (elapsed >= duration * 1000) { // Duration passed, closing the loop.
      lights.forEach((light) => { // At the end of the loop, turn on all the lights.
        light.classList.add("light-on")
      })
      clearInterval(timer); // Kills the loop
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





