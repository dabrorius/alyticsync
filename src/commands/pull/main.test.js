const pull = require("./main");

describe("Pulling scripts from remote server", function() {
  it("creates correct files", function() {
    const fetchPromise = new Promise(function(resolve, reject) {
      resolve({
        data: {
          overrides: {
            graphic_script: "Script content",
            css: "CSS content",
            queries: "Queries content"
          }
        }
      });
    });
    const writeFileSpy = jasmine.createSpy("Write File Spy");
    const logSpy = jasmine.createSpy("Logging");

    pull(fetchPromise, writeFileSpy, logSpy);

    fetchPromise.then(function() {
      expect(writeFileSpy).toHaveBeenCalledWith(
        "./style.css",
        "CSS content",
        jasmine.any(Function)
      );
      expect(writeFileSpy).toHaveBeenCalledWith(
        "./script.js",
        "Script content",
        jasmine.any(Function)
      );
      expect(writeFileSpy).toHaveBeenCalledWith(
        "./queries.json",
        '"Queries content"',
        jasmine.any(Function)
      );
      expect(logSpy).toHaveBeenCalledWith(
        "Changes have been puled from alytic.io"
      );
    });
  });
});