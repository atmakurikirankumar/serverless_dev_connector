import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import getUserById from "../../lib/getUserById";
import getProfileByUserId from "../../lib/getProfileByUserId";
const getMyProfile = async (event, context) => {
  let user;
  let profile;
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

    profile = await getProfileByUserId(id);
    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `Profile does not exist for this user` }),
      };
    }
    profile.user = user;
  } catch (e) {
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ ...profile }),
  };
};

export const handler = commonMiddleware(getMyProfile);
