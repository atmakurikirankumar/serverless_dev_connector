import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import createError from "http-errors";
import { v4 as uuid } from "uuid";
import addOrRemoveEducation from "../../lib/addOrRemoveEducation";
import getUserById from "../../lib/getUserById";
import getProfileByUserId from "../../lib/getProfileByUserId";

const addEducation = async (event) => {
  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    description,
    current,
  } = event.body;

  const currentTime = new Date().getTime();
  if (new Date(from).getTime() > currentTime) {
    return {
      statusCode: 400,
      body: JSON.stringify({ msg: `From Date cant be the future date` }),
    };
  }

  const fromDate = new Date(from).toISOString();
  const toDate = (to && new Date(to).toISOString()) || "";
  const isCurrent = current || false;

  const newEducation = {
    id: uuid(),
    school,
    degree,
    fieldofstudy,
    from: fromDate,
    to: toDate,
    description,
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

    const educationHistory = profile.education || [];
    educationHistory.unshift(newEducation);
    updatedProfile = await addOrRemoveEducation(profile.id, educationHistory);
    updatedProfile.user = user;
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ profile: updatedProfile }),
  };
};

export const handler = commonMiddleware(addEducation);
