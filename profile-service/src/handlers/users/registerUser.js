import { v4 as uuid } from "uuid";
import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import AWS from "aws-sdk";
import bcrypt from "bcryptjs";
import signToken from "../../lib/signToken";
import getUserByEmail from "../../lib/getUserByEmail";
import gravatar from "gravatar";
const normalize = require("normalize-url");

const dynamodb = new AWS.DynamoDB.DocumentClient();

const registerUser = async (event) => {
  const { name, email, password } = event.body;
  let token;
  let user;

  try {
    user = await getUserByEmail(email);
    if (user) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          msg: `User already exists`,
        }),
      };
    }
    user = { id: uuid(), name, email, password };
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.avatar = normalize(
      gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      }),
      { forceHttps: true }
    );
    await dynamodb
      .put({
        TableName: process.env.USERS_TABLE_NAME,
        Item: user,
      })
      .promise();
    token = await signToken(user);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(token),
  };
};

export const handler = commonMiddleware(registerUser);
