/**
 * Read the local style, script and query files
 * update the alytics.io database with its contents
 */
function push(authToken, httpClient, readFile, config) {
  const css = readFile("./style.css", "utf-8", err => console.log(err));

  let graphic_script = "";

  const { scripts, deckId, cardId } = config;

  const sourceFiles = scripts;
  console.log("Compiling script from: ", sourceFiles);
  const sources = sourceFiles.map(filename => {
    const comment = `//@sync[${filename}]\r\n`;
    return comment + readFile(filename, "utf-8");
  });
  graphic_script = sources.join("\n\r");

  const queries = JSON.parse(
    readFile("./queries.json", "utf-8", err => console.log(err))
  );

  httpClient
    .patch(
      `https://alytic.io/api/v2/decks/${deckId}/cards/${cardId}`,
      { overrides: { css, graphic_script, queries } },
      {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json"
        }
      }
    )
    .then(function(response) {
      console.log("Changes have been pushed to alytic.io");
    })
    .catch(function(error) {
      console.log(error);
    });
}

module.exports = push;
