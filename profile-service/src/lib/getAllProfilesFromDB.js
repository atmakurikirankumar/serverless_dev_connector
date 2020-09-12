import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getAllProfilesFromDB = async () => {
  const params = {
    TableName: process.env.PROFILES_TABLE_NAME,
  };
  const result = await dynamodb.scan(params).promise();
  return result.Items;
};

export default getAllProfilesFromDB;
