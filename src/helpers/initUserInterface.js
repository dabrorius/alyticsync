const readline = require("readline");

/**
 * Initialize and configure a text UI using `readLine`
 */
function initUserInterface() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Extend the `_writeToOutput` function to allow muting
  // This is used to hide user input while entering a password
  rl._writeToOutput = stringToWrite => {
    if (!rl.stdoutMuted) {
      rl.output.write(stringToWrite);
    }
  };
  return rl;
}

module.exports = initUserInterface;
