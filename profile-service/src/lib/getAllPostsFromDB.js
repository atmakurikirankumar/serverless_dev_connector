import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllPostsFromDB = async () => {
  const params = {
    TableName: process.env.POSTS_TABLE_NAME,
  };
  const result = await dynamodb.scan(params).promise();
  return result.Items;
};

export default getAllPostsFromDB;
