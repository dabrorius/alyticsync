const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

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



