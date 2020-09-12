import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const removeUserFromDB = async (userId) => {
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    Key: { id: userId },
  };
  return await dynamodb.delete(params).promise();
};

export default removeUserFromDB;
