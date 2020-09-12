import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import addOrRemoveEducation from "../../lib/addOrRemoveEducation";
import getProfileByUserId from "../../lib/getProfileByUserId";
import getUserById from "../../lib/getUserById";

const deleteEducation = async (event) => {
  const { edu_id } = event.pathParameters;
  let education_history, updatedProfile;
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

    education_history = profile.education || [];
    education_history = education_history.filter(
      (edu) => edu.id.toString() !== edu_id
    );
    profile.education = education_history;
    updatedProfile = await addOrRemoveEducation(profile.id, education_history);
    updatedProfile.user = user;
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ profile: updatedProfile }),
  };
};

export const handler = commonMiddleware(deleteEducation);
