import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getProfileByUserId from "../../lib/getProfileByUserId";
import getUserById from "../../lib/getUserById";

const getProfileByUser = async (event) => {
  const { user_id } = event.pathParameters;
  let profile;
  try {
    profile = await getProfileByUserId(user_id);
    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `Profile Not Found ` }),
      };
    }
    profile.user = await getUserById(user_id);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(profile),
  };
};

export const handler = commonMiddleware(getProfileByUser);
