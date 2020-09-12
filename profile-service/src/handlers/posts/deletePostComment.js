import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getSinglePostById from "../../lib/getSinglePostById";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import addOrRemoveComments from "../../lib/addOrRemoveComments";

const deletePostComment = async (event) => {
  const { post_id, comment_id } = event.pathParameters;
  let post, updatedPost, comments;

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

    comments = post.comments || [];

    const comment = comments.find((comment) => comment.id === comment_id);

    if (!comment) {
      return {
        statusCode: 404,
        body: JSON.stringify({ msg: `Comment does not exist` }),
      };
    }

    // Check user
    if (comment.user.toString() !== id) {
      return {
        statusCode: 401,
        body: JSON.stringify({ msg: `User not authorized` }),
      };
    }

    comments = comments.filter((comment) => comment.id !== comment_id);
    updatedPost = await addOrRemoveComments(post.id, comments);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedPost.comments),
  };
};

export const handler = commonMiddleware(deletePostComment);
