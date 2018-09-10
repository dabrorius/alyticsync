// Hide password when logging in
// Add config file that contains deck and card id
// Handle API errors better
//
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const command = process.argv[2];

switch(command) {
  case 'view': {
    view();
    break;
  }
  case 'pull': {
    pull();
    break;
  }
  case 'init': {
    init();
    break;
  }
  case 'push': {
    push();
    break;
  }
  case 'login': {
    login();
    break;
  }
  case 'watch': {
    watch();
    break;
  }
  default: {
    console.log(`Unknown command '${command}'.`);
  }
}

function init() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Deck id: ', (deckId) => {
    rl.question('Card id: ', (cardId) => {
      fs.writeFile('./.alyticscfg', JSON.stringify({deckId, cardId}, null, 2), (err) => console.log(err));
      console.log('Configuration has been saved.');
      rl.close();
    });
  });
}

function view() {
  const {deckId, cardId} = getConfig();
  console.log(`https://alytic.io/a/card/${deckId}/${cardId}/headless`);
}

// Ask for username and password
// Get the token and write it to `.alyticstoken` file
function login() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Username: ', (user_name) => {
    rl.question('Password: ', (password) => {
      axios.post('https://alytic.io/api/v2/account/login', {user_name, password})
      .then(function (response) {
        const token = response.data.token.access_token;
        fs.writeFile('.alyticstoken', `Bearer ${token}`, (e) => console.log(e));
        console.log('Success! You are now logged in.')
      })
      .catch((error) => {
        console.log(error);
      })
      rl.close();
    });
  });  
}

// Read the files from the server and write them locally
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

// Read local files and write them to server
function push() {
  const authToken = getAuthToken();
  const css = fs.readFileSync('./style.css', "utf-8", (err) => console.log(err));
  const graphic_script = fs.readFileSync('./script.js', "utf-8", (err) => console.log(err));
  const queries = JSON.parse(fs.readFileSync('./queries.json', "utf-8", (err) => console.log(err)));

  const {deckId, cardId} = getConfig();
  axios.patch(`https://alytic.io/api/v2/decks/${deckId}/cards/${cardId}`, {overrides: {css, graphic_script, queries}}, {
      headers: {Authorization: authToken, 'Content-Type': 'application/json'}
    })
    .then(function (response) {
      console.log('Changes have been pushed to alytic.io');
    })
    .catch(function (error) {
      console.log(error);
    });
}

function watch() {
  const handleChange = () => {
    console.log('Change detected...');
    push();
  }
  fs.watchFile('./style.css', handleChange);
  fs.watchFile('./script.js', handleChange);
  fs.watchFile('./queries.json', handleChange);
}

function getAuthToken() {
  try {
    return fs.readFileSync('.alyticstoken', "utf-8");
  } catch {
    console.log('Please login first!');
    process.exit(1);
  }
}

function getConfig() {
  try {
    return JSON.parse(fs.readFileSync('.alyticscfg', "utf-8"));
  } catch {
    console.log('Deck and card ids are missing. Please run `init` command first.');
    process.exit(1);
  }
}