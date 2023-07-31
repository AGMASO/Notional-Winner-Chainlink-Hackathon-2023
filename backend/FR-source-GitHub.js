// This example shows how to make a call to an open API ( authentication required)

// Arguments can be provided when a request is initated on-chain and used in the request source code as shown below
console.log("TESTETSTTETSTETS");
// https://github.com/testaccount2347/Test_Repo
// https://api.github.com/users/timmywheels/repos
// https://api.github.com/users/testaccount2347/repos
// https://api.github.com/users/testaccount2347/repos/{owner}/{repo}/pulls
// https://api.github.com/repos/testaccount2347/Test_Repo/pulls
// https://api.github.com/repos/testaccount2347/Test_Repo/pull/4
// https://api.github.com/repos/testaccount2347/Test_Repo/pulls?q=is:open+is:pr
// https://api.github.com/search/issues?q=repo:testaccount2347/Test_Repo+type:pr+is:merged
// https://api.github.com/repos/:testaccount2347/:Test_Repo/pulls?state=all

const issueId = 6;
const username = 'testaccount2347';
const repoName = 'Test_Repo';
const url = `https://api.github.com/search/issues?q=repo:${username}/${repoName}+type:pr+is:merged`;
console.log(url);

const token = "<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"; //.env not working
//const headers = { Authorization: `Bearer ${token}`};
//const headers = { linked: "1"};

// construct the HTTP Request object. See: https://github.com/smartcontractkit/functions-hardhat-starter-kit#javascript-code
// params used for URL query parameters
// Example of query: https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD
const userGitHubRequest = Functions.makeHttpRequest({
  url: url,
  method: "GET",
  //headers: headers,
});

// Execute the API request (Promise)
const userGitHubResponse = await userGitHubRequest;
if (userGitHubResponse.error) {
  console.error(userGitHubResponse.error);
  throw Error("Request failed");
}

const data = userGitHubResponse["data"].items;
if (data.Response === "Error") {
  console.error(data.Message);
  throw Error(`Functional error. Read message: ${data.Message}`);
}

//console.log("TEST data", data, typeof data);
var mergedPulls = [];
for (let i = 0; i < data.length; ++i) {
  //console.log("TEST data url", data[i].url, typeof data[i].url);
  //console.log("TEST data pull number", data[i].number, typeof data[i].number);
  //const pullNumber = data[i].number;
  mergedPulls.push(data[i].number);
}

for (let i = 0; i < mergedPulls.length; ++i) {
  console.log(mergedPulls[i]);
  const commits_url = `https://api.github.com/repos/${username}/${repoName}/pulls/${mergedPulls[i]}/commits`;
  //console.log(commits_url);

  const commitsRequest = Functions.makeHttpRequest({
    url: commits_url,
    method: "GET",
  });
  // Execute the API request (Promise)
  const commitsResponse = await commitsRequest;
  if (commitsResponse.error) {
    console.error(commitsResponse.error);
    throw Error("Request failed");
  }
  const commits_data = commitsResponse["data"];
  if (commits_data.Response === "Error") {
    console.error(commits_data.Message);
    throw Error(`Functional error. Read message: ${commits_data.Message}`);
  }

  const commit_msg = commits_data[0].commit.message;
 
  if(commit_msg.includes(`#${issueId}`)) {
    console.log("FOUND PR THAT CLOSED THE ISSUE")

    const author_username = commits_data[0].author.login;
    //const author_email = commits_data[0].commit.author.email;

    console.log("commits_data commit_msg", commit_msg);
    console.log("commits_data author_username", author_username);
    //console.log("commits_data author_email", author_email);
    console.log("userRepoIssue", `${author_username}/${username}/${repoName}/${issueId}`)
    //return Buffer.concat([Functions.encodeString(author_username), Functions.encodeString(`${username}/${repoName}/${issueId}`)]);
    return Functions.encodeString(`${author_username}/${username}/${repoName}/${issueId}`);
  }
}

return Buffer.Functions.encodeString("null_test_string");

// Solidity doesn't support decimals so multiply by 100 and round to the nearest integer
// Use Functions.encodeUint256 to encode an unsigned integer to a Buffer
return Functions.encodeString(author);
