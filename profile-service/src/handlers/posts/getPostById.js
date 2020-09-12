import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getSinglePostById from "../../lib/getSinglePostById";

const getPostById = async (event) => {
  const { post_id } = event.pathParameters;
  let post;

  try {
    post = await getSinglePostById(post_id);
    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `Post does not exist` }),
      };
    }
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(post),
  };
};

export const handler = commonMiddleware(getPostById);
