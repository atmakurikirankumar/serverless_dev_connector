import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

const getProfileByUserId = async (user) => {
  const params = {
    TableName: process.env.PROFILES_TABLE_NAME,
    IndexName: process.env.PROFILES_TABLE_GSI,
    KeyConditionExpression: "#user = :user",
    ExpressionAttributeValues: {
      ":user": user,
    },
    ExpressionAttributeNames: {
      "#user": "user",
    },
  };
  const result = await dynamodb.query(params).promise();
  return result.Items[0];
};

export default getProfileByUserId;
