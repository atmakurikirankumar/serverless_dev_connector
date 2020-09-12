import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getAllProfilesFromDB from "../../lib/getAllProfilesFromDB";
import getUserByProfile from "../../lib/getUserByProfile";

const getAllProfiles = async (event, context) => {
  let updatedProfiles;
  try {
    const profiles = await getAllProfilesFromDB();
    if (!profiles && profiles.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `Profiles does not exist` }),
      };
    }
    updatedProfiles = await Promise.all(profiles.map(getUserByProfile));
  } catch (e) {
    throw new createError.InternalServerError(e);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedProfiles),
  };
};

export const handler = commonMiddleware(getAllProfiles);
