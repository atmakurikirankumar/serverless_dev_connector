import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getUserByEmail = async (userEmail) => {
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    IndexName: process.env.USERS_TABLE_GSI,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": userEmail,
    },
    ProjectionExpression: "id, #name, email, avatar",
    ExpressionAttributeNames: {
      "#name": "name",
    },
  };
  const result = await dynamodb.query(params).promise();
  const user = result.Items[0];
  return user;
};

export default getUserByEmail;
