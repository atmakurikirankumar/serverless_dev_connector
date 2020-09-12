import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const likeOrUnlikePost = async (id, likes) => {
  const params = {
    TableName: process.env.POSTS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set likes = :likes",
    ExpressionAttributeValues: {
      ":likes": likes,
    },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamodb.update(params).promise();
  return result.Attributes;
};

export default likeOrUnlikePost;
