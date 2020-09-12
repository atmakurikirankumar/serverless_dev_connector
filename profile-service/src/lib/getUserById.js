import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const getUserById = async (id) => {
  const params = {
    TableName: process.env.USERS_TABLE_NAME,
    Key: { id },
    ProjectionExpression: "id, #name, email, avatar",
    ExpressionAttributeNames: {
      "#name": "name",
    },
  };
  const result = await dynamodb.get(params).promise();
  return result.Item;
};

export default getUserById;
