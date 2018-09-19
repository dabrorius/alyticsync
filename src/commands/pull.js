/**
 * Fetch the current style, script and query
 * from the API
 * and write them to local files.
 */
function pull() {
  const authToken = getAuthToken();

  const {deckId, cardId} = getConfig();
  axios.get(`https://alytic.io/api/v2/decks/${deckId}/cards/${cardId}`, {headers: {Authorization: authToken}})
    .then(function (response) {
      const {graphic_script, css, queries} = response.data.overrides;
      fs.writeFile('./style.css', css, (err) => console.log(err));
      fs.writeFile('./script.js', graphic_script, (err) => console.log(err));
      fs.writeFile('./queries.json', JSON.stringify(queries, null, 2), (err) => console.log(err));
      console.log('Changes have been puled from alytic.io');
    });
}