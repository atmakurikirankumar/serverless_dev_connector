import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const removeProfileFromDB = async (profileId) => {
  const params = {
    TableName: process.env.PROFILES_TABLE_NAME,
    Key: { id: profileId },
  };
  return await dynamodb.delete(params).promise();
};

export default removeProfileFromDB;
