const axios = require('axios');
const fs = require('fs');
const authContent = fs.readFileSync('.alyticstoken', "utf-8", (err) => console.log(err));

axios.get('https://alytic.io/api/v2/decks/7569/cards/112207', {headers: {Authorization: authContent}})
  .then(function (response) {
    const {graphic_script, css, queries} = response.data.overrides;

    fs.writeFile('./style.css', css, (err) => console.log(err));
    fs.writeFile('./script.js', graphic_script, (err) => console.log(err));
    fs.writeFile('./queries.json', JSON.stringify(queries, null, 2), (err) => console.log(err));
    console.log(css);
  });