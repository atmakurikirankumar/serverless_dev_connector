import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getUserByProfile = async (profile) => {
  const id = profile.user;
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    Key: { id },
    ProjectionExpression: "id, #name, email, avatar",
    ExpressionAttributeNames: {
      "#name": "name",
    },
  };
  const result = await dynamodb.get(params).promise();
  profile.user = result.Item;
  return profile;
};

export default getUserByProfile;
