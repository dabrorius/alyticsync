const axios = require('axios');
const fs = require('fs');
const authContent = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImZpbGlwLmRlZmFyQHRvcHRhbC5jb20iLCJpc3MiOiJvbWVnYSIsInN1YiI6MTQyOCwidXNlciI6eyJpZCI6MTQyOCwidXNlcl9uYW1lIjoiZmlsaXAuZGVmYXJAdG9wdGFsLmNvbSIsImZ1bGxfbmFtZSI6IkZpbGlwIERlZmFyIiwiZGlzYWJsZWQiOmZhbHNlLCJzdXBlcl91c2VyIjpmYWxzZSwib3JnYW5pc2F0aW9uIjp7ImlkIjoxMTYsIm5hbWUiOiJUb3B0YWwiLCJzZXR0aW5ncyI6e30sImlzX293bmVyIjp0cnVlfX0sImlhdCI6MTUzNjMxODg3NSwiZXhwIjoxNTM2NDA1Mjc1fQ.n_SXKvxB7N_Y5lWcTei2YrQQkxAF83DQIZfhieBEtpo";

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