import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getUserCredentials = async (email) => {
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    IndexName: process.env.USERS_TABLE_GSI,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
    ProjectionExpression: "id,email,password",
  };
  const result = await dynamodb.query(params).promise();
  const user = result.Items[0];
  return user;
};

export default getUserCredentials;
