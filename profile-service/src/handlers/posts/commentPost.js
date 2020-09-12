import commonMiddleware from "../../lib/commonMiddleware";
import createError from "http-errors";
import getSinglePostById from "../../lib/getSinglePostById";
import getUserFromJWTToken from "../../lib/getUserFromJWTToken";
import { v4 as uuid } from "uuid";
import getUserById from "../../lib/getUserById";
import addOrRemoveComments from "../../lib/addOrRemoveComments";

const commentPost = async (event) => {
  const { post_id } = event.pathParameters;
  const { text } = event.body;
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

    const user = await getUserById(id);

    const comments = post.comments || [];

    const newComment = {
      id: uuid(),
      text,
      name: user.name,
      avatar: user.avatar,
      user: id,
    };

    comments.unshift(newComment);

    updatedPost = await addOrRemoveComments(post.id, comments);
  } catch (e) {
    throw new createError.InternalServerError(e);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedPost.comments),
  };
};

export const handler = commonMiddleware(commentPost);
