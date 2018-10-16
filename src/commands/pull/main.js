const splitScript = require("./splitScript.js");
const ensureDirectoryExistence = require("./ensureDirectoryExistence.js");
const errorHandler = require("../../errorHandler.js");

/**
 * Fetch the current style, script and query
 * from the API
 * and write them to local files.
 */
function pull(fetchPromise, writeFile, storeConfig, log) {
  fetchPromise
    .then(function(response) {
      const { overrides, template } = response.data;
      const templateWasOverriden =
        overrides && Object.keys(overrides).length > 0;
      const { graphic_script, css, queries } = templateWasOverriden
        ? overrides
        : template;
      writeFile("./style.css", css, errorHandler);
      const scripts = splitScript(graphic_script);
      scripts.forEach(script => {
        const filePath = `./${script.file}`;
        ensureDirectoryExistence(filePath);
        writeFile(filePath, script.content, errorHandler);
      });
      storeConfig({ scripts: scripts.map(s => s.file) });
      writeFile(
        "./queries.json",
        JSON.stringify(queries, null, 2),
        errorHandler
      );
      log("Changes have been puled from alytic.io");
    })
    .catch(errorHandler);
}

module.exports = pull;
