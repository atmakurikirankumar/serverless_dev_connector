import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import addOrRemoveExperience from "../../lib/addOrRemoveExperience";
import { v4 as uuid } from "uuid";
import getUserById from "../../lib/getUserById";
import getProfileByUserId from "../../lib/getProfileByUserId";

const addExperience = async (event) => {
  const {
    title,
    company,
    from,
    to,
    description,
    location,
    current,
  } = event.body;

  const currentTime = new Date().getTime();
  const fromTime = new Date(from).getTime();

  if (fromTime > currentTime) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: `From Date cant be the future date` }),
    };
  }

  const fromDate = new Date(from).toISOString();
  const toDate = (to && new Date(to).toISOString()) || "";
  const isCurrent = current || false;

  const newExperience = {
    id: uuid(),
    title,
    company,
    from: fromDate,
    to: toDate,
    description,
    location,
    isCurrent,
  };

  let updatedProfile;

  try {
    const {
      user: { id },
    } = await getUserFromJWTToken(event.headers.Authorization);

    const user = await getUserById(id);
    if (!user) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `User does not exist` }),
      };
    }

    const profile = await getProfileByUserId(id);
    if (!profile) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `Profile does not exist` }),
      };
    }

    const experiences = profile.experience || [];
    experiences.unshift(newExperience);
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

export const handler = commonMiddleware(addExperience);
