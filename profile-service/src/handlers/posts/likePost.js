import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getSinglePostById from "../../lib/getSinglePostById";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import { v4 as uuid } from "uuid";
import likeOrUnlikePost from "../../lib/likeOrUnlikePost";

const likePost = async (event) => {
  const { post_id } = event.pathParameters;
  let post, updatedPost;

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

    const likes = post.likes || [];

    if (likes.some((like) => like.user.toString() === id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ msg: `Post already liked by you` }),
      };
    }

    likes.unshift({ id: uuid(), user: id });
    updatedPost = await likeOrUnlikePost(post.id, likes);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedPost.likes),
  };
};

export const handler = commonMiddleware(likePost);
