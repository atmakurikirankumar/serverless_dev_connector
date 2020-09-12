import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import getUserById from "../../lib/getUserById";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const createPost = async (event) => {
  const { text } = event.body;

  let post, user, data;

  try {
    const {
      user: { id },
    } = await getUserFromJWTToken(event.headers.Authorization);

    user = await getUserById(id);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `User does not exist` }),
      };
    }

    post = {
      id: uuid(),
      text,
      name: user.name,
      avatar: user.avatar,
      user: user.id,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };

    const params = {
      TableName: process.env.POSTS_TABLE_NAME,
      Item: post,
    };

    await dynamodb.put(params).promise();
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 201,
    body: JSON.stringify(post),
  };
};

export const handler = commonMiddleware(createPost);
