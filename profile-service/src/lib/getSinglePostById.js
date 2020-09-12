import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getSinglePostById = async (id) => {
  const params = {
    TableName: process.env.POSTS_TABLE_NAME,
    Key: { id },
  };
  const result = await dynamodb.get(params).promise();
  return result.Item;
};

export default getSinglePostById;
