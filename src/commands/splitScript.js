module.exports = function splitScript(script) {
  const scriptLines = script
    .replace(/\r\n/g, "\r")
    .replace(/\n/g, "\r")
    .split(/\r/);

  const splitMarkRegex = /\/\/@sync\[(.*)\]/;
  const scriptFiles = scriptLines.reduce((result, current) => {
    console.log("-> ", current);
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
