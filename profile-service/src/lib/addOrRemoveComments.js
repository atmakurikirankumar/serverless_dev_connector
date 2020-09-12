import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const addOrRemoveComments = async (id, comments) => {
  const params = {
    TableName: process.env.POSTS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set comments = :comments",
    ExpressionAttributeValues: {
      ":comments": comments,
    },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamodb.update(params).promise();
  return result.Attributes;
};

export default addOrRemoveComments;
