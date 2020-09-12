import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const addOrRemoveEducation = async (profileId, educationHistory) => {
  const params = {
    TableName: process.env.PROFILES_TABLE_NAME,
    Key: { id: profileId },
    UpdateExpression: "set education = :educationHistory",
    ExpressionAttributeValues: {
      ":educationHistory": educationHistory,
    },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamodb.update(params).promise();
  return result.Attributes;
};

export default addOrRemoveEducation;
