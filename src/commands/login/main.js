/**
 * Ask for username and password
 * get the authentication token from the API
 * and write it to `.alyticstoken` file
 */
function login(readLine, httpClient, writeFile) {
  readLine.question("Username: ", user_name => {
    readLine.question("Password: ", password => {
      readLine.stdoutMuted = false;
      httpClient
        .post("https://alytic.io/api/v2/account/login", { user_name, password })
        .then(function(response) {
          const token = response.data.token.access_token;
          writeFile(".alyticstoken", `Bearer ${token}`, e => console.log(e));
          console.log("\nSuccess! You are now logged in.");
        })
        .catch(error => {
          console.log(error);
        });
      readLine.close();
    });
    readLine.stdoutMuted = true;
  });
}

module.exports = login;
