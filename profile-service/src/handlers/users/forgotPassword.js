import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";
import getUserByEmail from "../../lib/getUserByEmail";
import bcrypt from "bcryptjs";
import signToken from "../../lib/signToken";
import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const forgotPassword = async (event) => {
  let user, token;
  let { email, password } = event.body;
  try {
    user = await getUserByEmail(email);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          msg: `User does not exist`,
        }),
      };
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user.password = password;
    const result = await dynamodb
      .update({
        TableName: process.env.USERS_TABLE_NAME,
        Key: { id: user.id },
        UpdateExpression: "set password = :password",
        ExpressionAttributeValues: {
          ":password": password,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();
    user = result.Attributes;
    token = await signToken(user);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};

export const handler = commonMiddleware(forgotPassword);
