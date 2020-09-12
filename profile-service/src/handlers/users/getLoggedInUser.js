import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import commonMiddleware from "../../lib/commonMiddleware";
import getUserById from "../../lib/getUserById";

const getLoggedInUser = async (event) => {
  const {
    user: { id },
  } = await getUserFromJWTToken(event.headers.Authorization);

  let user;
  console.log(id);

  try {
    user = await getUserById(id);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          msg: `Invalid Credentials`,
        }),
      };
    }
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
};

export const handler = commonMiddleware(getLoggedInUser);
