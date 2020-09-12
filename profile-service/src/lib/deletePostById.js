import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const deletePostById = async (id) => {
  const params = {
    TableName: process.env.POSTS_TABLE_NAME,
    Key: { id },
  };
  return await dynamodb.delete(params).promise();
};

export default deletePostById;
