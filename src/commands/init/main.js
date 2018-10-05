/**
 * Ask user for Deck and Card id
 * and save that information locally
 */
function init(readLine, storeConfig, log) {
  readLine.question("Deck id: ", deckId => {
    readLine.question("Card id: ", cardId => {
      storeConfig({ deckId, cardId, scripts: [] });
      log("Deck and Card IDs have been stored.");
      readLine.close();
    });
  });
}

module.exports = init;
