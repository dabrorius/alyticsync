/**
 * Load the Deck and Card id
 * from the `.alyticscfg` file
 * and log the URL for viewing the card to the console
 */
function view(config) {
  const { deckId, cardId } = config;
  console.log(`https://alytic.io/a/card/${deckId}/${cardId}/headless`);
}

module.exports = view;
