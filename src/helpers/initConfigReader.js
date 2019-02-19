/**
 * Read alytic deck and card id from local filesystem
 */
function initConfigReader(path, fs) {
  return () => {
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path, "utf-8"));
    } else {
      console.log(
        "Deck and card ids are missing. Please run `init` command first."
      );
      process.exit(1);
    }
  };
}

module.exports = initConfigReader;
