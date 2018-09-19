const defaultFileName = "script.js";

/**
 * Finds split marks in given multi-line string
 * and returns an array of files to be created.
 * @param {string} script
 */
module.exports = function splitScript(script) {
  const splitMarkRegex = /\/\/@sync\[(.*)\]/;

  // If file does not contain any spilt markers
  // bundle everything under the default file name
  if (!splitMarkRegex.test(script)) {
    return [{ file: defaultFileName, content: script }];
  }

  const scriptLines = script
    .replace(/\r\n/g, "\r")
    .replace(/\n/g, "\r")
    .split(/\r/);

  const scriptFiles = scriptLines.reduce((result, current) => {
    if (splitMarkRegex.test(current)) {
      const file = current.match(splitMarkRegex)[1];
      result.push({ file, content: "" });
    } else {
      const lastFile = result[result.length - 1];
      if (lastFile) {
        lastFile.content += current + "\n";
      }
    }
    return result;
  }, []);
  return scriptFiles;
};
