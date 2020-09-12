import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

const addOrRemoveExperience = async (profileId, experiences) => {
  const params = {
    TableName: process.env.PROFILES_TABLE_NAME,
    Key: { id: profileId },
    UpdateExpression: "set experience = :experiences",
    ExpressionAttributeValues: {
      ":experiences": experiences,
    },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamodb.update(params).promise();
  return result.Attributes;
};

export default addOrRemoveExperience;
