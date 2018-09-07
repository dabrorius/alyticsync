const axios = require('axios');
const fs = require('fs');
const authContent = fs.readFileSync('.alyticstoken', "utf-8", (err) => console.log(err));

const css = fs.readFileSync('./style.css', "utf-8", (err) => console.log(err));
console.log(css);

axios.patch('https://alytic.io/api/v2/decks/7569/cards/112207', {overrides: {css}}, {
    headers: {Authorization: authContent, 'Content-Type': 'application/json'}
  })
  .then(function (response) {
    console.log('Done!');
  })
  .catch(function (error) {
    console.log(error);
  });