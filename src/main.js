const axios = require("axios");
const fs = require("fs");

const init = require("./commands/init/main.js");
const login = require("./commands/login/main.js");
const pull = require("./commands/pull/main.js");
const push = require("./commands/push/main.js");
const view = require("./commands/view/main.js");
const watch = require("./commands/watch/main.js");

const initUserInterface = require("./helpers/initUserInterface");
const initConfigReader = require("./helpers/initConfigReader");
const initConfigWriter = require("./helpers/initConfigWriter");
const initAuthTokenReader = require("./helpers/initAuthTokenReader");

const configurationPath = "./asconfig.json";
const tokenPath = ".alyticstoken";

/**
 * This is the main entry point of the CLI
 *
 * It reads the command line argument passed to the `alytic` command
 * and calls appropriate function from the `/commands/` folder.
 */
function execute() {
  const command = process.argv[2];
  switch (command) {
    case "init": {
      const ui = initUserInterface();
      const configWriter = initConfigWriter(configurationPath, fs);
      init(ui, configWriter, console.log);
      break;
    }
    case "login": {
      const ui = initUserInterface();
      login(ui, axios, fs.writeFile);
      break;
    }
    case "view": {
      const config = initConfigReader(configurationPath, fs)();
      view(config);
      break;
    }
    case "pull": {
      const authToken = initAuthTokenReader(tokenPath, fs)();
      const config = initConfigReader(configurationPath, fs)();
      const configWriter = initConfigWriter(configurationPath, fs);
      pull(authToken, axios, fs.writeFile, config, configWriter, console.log);
      break;
    }
    case "push": {
      const authToken = initAuthTokenReader(tokenPath, fs)();
      const config = initConfigReader(configurationPath, fs)();
      push(authToken, axios, fs.readFileSync, config);
      break;
    }
    case "watch": {
      const authToken = initAuthTokenReader(tokenPath, fs)();
      const config = initConfigReader(configurationPath, fs)();
      watch(authToken, axios, fs.readFileSync, config, fs.watchFile);
      break;
    }
    default: {
      console.log(`Unknown command '${command}'.`);
    }
  }
}

exports.execute = execute;
