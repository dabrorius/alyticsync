const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const init = require("./commands/init/main.js");
const pull = require("./commands/pull/main.js");

const configurationPath = "./asconfig.json";

exports.execute = function() {
  const command = process.argv[2];
  switch (command) {
    case "init": {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      init(rl, storeConfig, console.log);
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
      pull(fetchPromise, fs.writeFile, storeConfig, console.log);
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

  const config = getConfig();

  const sourceFiles = config.scripts;
  console.log("Compiling script from: ", sourceFiles);
  const sources = sourceFiles.map(filename => {
    const comment = `//@sync[${filename}]\r\n`;
    return comment + fs.readFileSync(filename, "utf-8");
  });
  graphic_script = sources.join("\n\r");

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
  const config = getConfig();
  let filesToWatch = ["./queries.json", "./style.css"].concat(config.scripts);
  console.log("Started watching...");
  console.log(filesToWatch);

  filesToWatch.forEach(file => fs.watchFile(file, handleChange));
  push();
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

function storeConfig(content) {
  let config = {};
  if (fs.existsSync(configurationPath)) {
    config = JSON.parse(fs.readFileSync(configurationPath, "utf-8"));
  }
  config = Object.assign(config, content);
  fs.writeFileSync(configurationPath, JSON.stringify(config, null, 2), err =>
    console.log(err)
  );
}

/**
 * Read alytic deck and card id from local filesystem
 */
function getConfig() {
  try {
    return JSON.parse(fs.readFileSync(configurationPath, "utf-8"));
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
// function getSourceFilesList() {
//   const sourceFilesBlock = fs.readFileSync(".sourcefiles", "utf-8");
//   const sourceFiles = sourceFilesBlock
//     .replace(/\r\n/g, "\r")
//     .replace(/\n/g, "\r")
//     .split(/\r/);
//   return sourceFiles;
// }
