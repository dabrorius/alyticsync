const push = require("../push/main.js");

/**
 * Watch style, script and query file for changes
 * and trigger a `push` command when changes are detected
 */
function watch(authToken, httpClient, readFile, config, watchFile) {
  const handleChange = () => {
    console.log("Change detected...");
    push(authToken, httpClient, readFile, config);
  };
  let filesToWatch = ["./queries.json", "./style.css"].concat(config.scripts);
  console.log("Started watching...");
  console.log(filesToWatch);

  filesToWatch.forEach(file => watchFile(file, handleChange));
  push(authToken, httpClient, readFile, config);
}

module.exports = watch;
