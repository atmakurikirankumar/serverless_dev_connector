import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import bcrypt from "bcryptjs";
import signToken from "../../lib/signToken";
import getUserCredentials from "../../lib/getUserCredentials";

const userLogin = async (event) => {
  const { email, password } = event.body;
  let token;
  let user;

  try {
    user = await getUserCredentials(email);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          msg: `Invalid Credentials`,
        }),
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `Invalid Credentials` }),
      };
    }

    token = await signToken(user);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(token),
  };
};

export const handler = commonMiddleware(userLogin);
