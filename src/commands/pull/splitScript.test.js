const splitScript = require("./splitScript");

describe("Splitting script", function() {
  it("assigns everything to script.js by default", function() {
    const script = `Hello world!`;
    const result = splitScript(script);
    expect(result).toEqual([{ file: "script.js", content: "Hello world!" }]);
  });

  it("assigns corret content to each file specified", function() {
    const script = `
      //@sync[src/helloWorld.js]
      helloWorld
      //@sync[src/byebye.js]
      byebye`;
    const result = splitScript(script);
    expect(result).toEqual([
      {
        file: "src/helloWorld.js",
        content: "      helloWorld\n"
      },
      {
        file: "src/byebye.js",
        content: "      byebye\n"
      }
    ]);
  });
});
