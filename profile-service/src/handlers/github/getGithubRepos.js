import commonMiddleware from "../../lib/commonMiddleware";
import axios from "axios";
import createError from "http-errors";

const getGithubRepos = async (event) => {
  const { github_username } = event.pathParameters;
  const github_token = process.env.GITHUB_TOKEN;
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${github_username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${github_token}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return {
      statusCode: 200,
      body: JSON.stringify(gitHubResponse.data),
    };
  } catch (err) {
    console.error(err.message);
    throw new createError.InternalServerError(err);
  }
};

export const handler = commonMiddleware(getGithubRepos);
