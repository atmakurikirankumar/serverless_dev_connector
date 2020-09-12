import commonMiddleware from "../../lib/commonMiddleware";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import normalize from "normalize-url";
import createError from "http-errors";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import getProfileByUserId from "../../lib/getProfileByUserId";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const createProfile = async (event) => {
  const {
    company,
    location,
    bio,
    status,
    skills,
    githubusername,
    youtube,
    linkedin,
    website,
    twitter,
    facebook,
    instagram,
  } = event.body;

  let profile, social, id;

  try {
    if (skills === "" || status === "") {
      return {
        statusCode: 400,
        body: JSON.stringify({
          msg: `Skills and Status cant be empty to create a profile`,
        }),
      };
    }
    const { user } = await getUserFromJWTToken(event.headers.Authorization);

    id = uuid();
    profile = {
      user: user.id,
      company,
      location,
      website:
        website && website !== ""
          ? normalize(website, { forceHttps: true })
          : "",
      bio,
      skills: Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => skill.trim()),
      status,
      githubusername,
    };

    social = { youtube, twitter, instagram, linkedin, facebook };

    for (const [key, value] of Object.entries(social)) {
      if (value && value.length > 0)
        social[key] = normalize(value, { forceHttps: true });
    }
    profile.social = social;

    const existingProfile = await getProfileByUserId(user.id);

    if (existingProfile) {
      if (existingProfile.education) {
        profile.education = existingProfile.education;
      }

      if (existingProfile.experience) {
        profile.experience = existingProfile.experience;
      }

      const params = {
        TableName: process.env.PROFILES_TABLE_NAME,
        Item: { id: existingProfile.id, ...profile },
      };
      await dynamodb.put(params).promise();

      return {
        statusCode: 201,
        body: JSON.stringify({
          profile: { id: existingProfile.id, ...profile },
        }),
      };
    }

    // Insert profile
    const params = {
      TableName: process.env.PROFILES_TABLE_NAME,
      Item: { id: uuid(), ...profile },
    };
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({ profile: { id, ...profile } }),
    };
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(createProfile);
