const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const pull = require("./commands/pull/main.js");

exports.execute = function() {
  const command = process.argv[2];
  switch (command) {
    case "init": {
      init();
      break;
    }
    case "login": {
      login();
      break;
    }
    case "view": {
      view();
      break;
    }
    case "pull": {
      const authToken = getAuthToken();
      const { deckId, cardId } = getConfig();
      const fetchPromise = axios.get(
        `https://alytic.io/api/v2/decks/${deckId}/cards/${cardId}`,
        { headers: { Authorization: authToken } }
      );
      pull(fetchPromise, fs.writeFile, console.log);
      break;
    }
    case "push": {
      push();
      break;
    }
    case "watch": {
      watch();
      break;
    }
    default: {
      console.log(`Unknown command '${command}'.`);
    }
  }
};

/**
 * Ask user for Deck and Card id
 * and save that information locally
 * to a `.alyticscfg` file
 */
function init() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Deck id: ", deckId => {
    rl.question("Card id: ", cardId => {
      fs.writeFile(
        "./.alyticscfg",
        JSON.stringify({ deckId, cardId }, null, 2),
        err => console.log(err)
      );
      console.log("Configuration has been saved.");
      rl.close();
    });
  });
}

/**
 * Load the Deck and Card id
 * from the `.alyticscfg` file
 * and log the URL for viewing the card to the console
 */
function view() {
  const { deckId, cardId } = getConfig();
  console.log(`https://alytic.io/a/card/${deckId}/${cardId}/headless`);
}

/**
 * Ask for username and password
 * get the authentication token from the API
 * and write it to `.alyticstoken` file
 */
function login() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl._writeToOutput = stringToWrite => {
    if (!rl.stdoutMuted) {
      rl.output.write(stringToWrite);
    }
  };

  rl.question("Username: ", user_name => {
    rl.question("Password: ", password => {
      rl.stdoutMuted = false;
      axios
        .post("https://alytic.io/api/v2/account/login", { user_name, password })
        .then(function(response) {
          const token = response.data.token.access_token;
          fs.writeFile(".alyticstoken", `Bearer ${token}`, e => console.log(e));
          console.log("\nSuccess! You are now logged in.");
        })
        .catch(error => {
          console.log(error);
        });
      rl.close();
    });
    rl.stdoutMuted = true;
  });
}

/**
 * Read the local style, script and query files
 * update the alytics.io database with its contents
 */
function push() {
  const authToken = getAuthToken();
  const css = fs.readFileSync("./style.css", "utf-8", err => console.log(err));

  let graphic_script = "";

  if (fs.existsSync(".sourcefiles")) {
    console.log("Has .sourcefiles? YES!");
    const sourceFiles = getSourceFilesList();
    console.log("Compiling script from: ", sourceFiles);
    const sources = sourceFiles.map(filename => {
      const comment = `//@sync[${filename}]\r\n`;
      return comment + fs.readFileSync(filename, "utf-8");
    });
    graphic_script = sources.join("\n\r");
  } else {
    console.log("Has .sourcefile? no");
    graphic_script = fs.readFileSync("./script.js", "utf-8", err =>
      console.log(err)
    );
  }

  const queries = JSON.parse(
    fs.readFileSync("./queries.json", "utf-8", err => console.log(err))
  );

  const { deckId, cardId } = getConfig();
  axios
    .patch(
      `https://alytic.io/api/v2/decks/${deckId}/cards/${cardId}`,
      { overrides: { css, graphic_script, queries } },
      {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json"
        }
      }
    )
    .then(function(response) {
      console.log("Changes have been pushed to alytic.io");
    })
    .catch(function(error) {
      console.log(error);
    });
}

/**
 * Watch style, script and query file for changes
 * and trigger a `push` command when changes are detected
 */
function watch() {
  const handleChange = () => {
    console.log("Change detected...");
    push();
  };
  let filesToWatch = ["./queries.json", "./style.css"];
  if (fs.existsSync(".sourcefiles")) {
    console.log("Has .sourcefile? YES!");
    filesToWatch = filesToWatch.concat(getSourceFilesList());
  } else {
    console.log("Has .sourcefiles? no");
    filesToWatch.push("./script.js");
  }

  console.log("Started watching...");
  console.log(filesToWatch);

  filesToWatch.forEach(file => fs.watchFile(file, handleChange));
}

/**
 * Read auth token from local filesystem
 */
function getAuthToken() {
  try {
    return fs.readFileSync(".alyticstoken", "utf-8");
  } catch {
    console.log("Please login first!");
    process.exit(1);
  }
}

/**
 * Read alytic deck and card id from local filesystem
 */
function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(".alyticscfg", "utf-8"));
  } catch {
    console.log(
      "Deck and card ids are missing. Please run `init` command first."
    );
    process.exit(1);
  }
}

/**
 * Reads a list of source files from .sourcefiles
 * and returns it as an array of strings
 */
function getSourceFilesList() {
  const sourceFilesBlock = fs.readFileSync(".sourcefiles", "utf-8");
  const sourceFiles = sourceFilesBlock
    .replace(/\r\n/g, "\r")
    .replace(/\n/g, "\r")
    .split(/\r/);
  return sourceFiles;
}
