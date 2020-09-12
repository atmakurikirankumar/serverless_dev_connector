import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import addOrRemoveExperience from "../../lib/addOrRemoveExperience";
import getProfileByUserId from "../../lib/getProfileByUserId";
import getUserById from "../../lib/getUserById";

const deleteProfile = async (event) => {
  const { exp_id } = event.pathParameters;
  let experiences, updatedProfile;
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

    experiences = profile.experience || [];
    experiences = experiences.filter((exp) => exp.id.toString() !== exp_id);
    profile.experience = experiences;
    updatedProfile = await addOrRemoveExperience(profile.id, experiences);
    updatedProfile.user = user;
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ profile: updatedProfile }),
  };
};

export const handler = commonMiddleware(deleteProfile);
