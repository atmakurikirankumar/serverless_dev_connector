import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getSinglePostById from "../../lib/getSinglePostById";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import likeOrUnlikePost from "../../lib/likeOrUnlikePost";

const unLikePost = async (event) => {
  const { post_id } = event.pathParameters;
  let post, updatedPost, likes;

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

    likes = post.likes || [];

    if (!likes.some((like) => like.user.toString() === id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `Post Not liked yet` }),
      };
    }

    likes = likes.filter(({ user }) => user.toString() !== id);
    updatedPost = await likeOrUnlikePost(post.id, likes);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedPost.likes),
  };
};

export const handler = commonMiddleware(unLikePost);
