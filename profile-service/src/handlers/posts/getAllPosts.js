import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getAllPostsFromDB from "../../lib/getAllPostsFromDB";

const getAllPosts = async (event) => {
  let posts;

  try {
    posts = await getAllPostsFromDB();
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(posts),
  };
};

export const handler = commonMiddleware(getAllPosts);
