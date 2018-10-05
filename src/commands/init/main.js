/**
 * Ask user for Deck and Card id
 * and save that information locally
 */
function init(ask, done, storeConfig, log) {
  ask("Deck id: ", deckId => {
    ask("Card id: ", cardId => {
      storeConfig({ deckId, cardId, scripts: ["./script.js"] });
      log("Deck and Card IDs have been stored.");
      done();
    });
  });
}

module.exports = init;
