const splitScript = require("./splitScript.js");

/**
 * Fetch the current style, script and query
 * from the API
 * and write them to local files.
 */
function pull(fetchPromise, writeFile, log) {
  const errorHandler = err => console.log(err);
  fetchPromise.then(function(response) {
    const { graphic_script, css, queries } = response.data.overrides;
    writeFile("./style.css", css, errorHandler);
    splitScript(graphic_script).forEach(script => {
      writeFile(`./${script.file}`, script.content, errorHandler);
    });
    writeFile("./queries.json", JSON.stringify(queries, null, 2), errorHandler);
    log("Changes have been puled from alytic.io");
  });
}

module.exports = pull;
