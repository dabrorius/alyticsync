/**
 * Read auth token from local filesystem
 */
function initAuthTokenReader(path, fs) {
  return () => {
    if (fs.existsSync(path)) {
      return fs.readFileSync(".alyticstoken", "utf-8");
    } else {
      console.log("Please login first!");
      process.exit(1);
    }
  };
}
module.exports = initAuthTokenReader;
