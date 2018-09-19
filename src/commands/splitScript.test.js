const splitScript = require("./splitScript");

describe("Splitting script", function() {
  it("Test Example 1", function() {
    const script = `
      //@sync[src/helloWorld.js]
      helloWorld
      //@sync[src/byebye.js]
      byebye`;
    const result = splitScript(script);
    console.log(result);
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
