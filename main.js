const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const command = process.argv[2];

switch(command) {
  case 'pull': {
    pull();
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
  default: {
    console.log(`Unknown command '${command}'.`);
  }
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
  axios.get('https://alytic.io/api/v2/decks/7569/cards/112207', {headers: {Authorization: authToken}})
    .then(function (response) {
      const {graphic_script, css, queries} = response.data.overrides;
      fs.writeFile('./style.css', css, (err) => console.log(err));
      fs.writeFile('./script.js', graphic_script, (err) => console.log(err));
      fs.writeFile('./queries.json', JSON.stringify(queries, null, 2), (err) => console.log(err));
      console.log(css);
    });
}

// Read local files and write them to server
function push() {
  const authToken = getAuthToken();
  const css = fs.readFileSync('./style.css', "utf-8", (err) => console.log(err));
  axios.patch('https://alytic.io/api/v2/decks/7569/cards/112207', {overrides: {css}}, {
      headers: {Authorization: authToken, 'Content-Type': 'application/json'}
    })
    .then(function (response) {
      console.log('Done!');
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getAuthToken() {
  try {
    return fs.readFileSync('.alyticstoken', "utf-8");
  } catch {
    console.log('Please login first!');
    process.exit(1);
  }
}