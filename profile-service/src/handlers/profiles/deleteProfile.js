import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import removeUserFromDB from "../../lib/removeUserFromDB";
import removeProfileFromDB from "../../lib/removeProfileFromDB";
import getProfileByUserId from "../../lib/getProfileByUserId";
import getUserById from "../../lib/getUserById";

const deleteProfile = async (event) => {
  try {
    const {
      user: { id },
    } = await getUserFromJWTToken(event.headers.Authorization);

    const profile = await getProfileByUserId(id);
    if (!profile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `Profile does not exist` }),
      };
    }

    const user = await getUserById(id);
    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `User does not exist` }),
      };
    }

    await Promise.all([
      removeUserFromDB(user.id),
      removeProfileFromDB(profile.id),
    ]);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ msg: `User/Profile deleted successfully` }),
  };
};

export const handler = commonMiddleware(deleteProfile);
