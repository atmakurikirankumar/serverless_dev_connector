import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getSinglePostById from "../../lib/getSinglePostById";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import deletePostById from "../../lib/deletePostById";

const deletePost = async (event) => {
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

    const {
      user: { id },
    } = await getUserFromJWTToken(event.headers.Authorization);

    if (post.user !== id) {
      return {
        statusCode: 403,
        body: JSON.stringify({
          msg: `You are not Authorized to remove this post`,
        }),
      };
    }

    await deletePostById(post_id);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ msg: `Post Removed` }),
  };
};

export const handler = commonMiddleware(deletePost);
