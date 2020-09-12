import getUserFromJWTToken from "../lib/getUserFromJWTToken";

const generatePolicy = async (principalId, methodArn) => {
    const apiGatewayWildcard = methodArn.split("/", 2).join("/") + "/*";
    return {
        principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Action: "execute-api:Invoke",
                    Effect: "Allow",
                    Resource: apiGatewayWildcard,
                },
            ],
        },
    };
};

const auth = async (event) => {
    if (!event.authorizationToken || !event.methodArn) {
        throw "Unauthorized";
    }

    const token = event.authorizationToken.replace("Bearer ", "");
    const {
        user: { id },
    } = await getUserFromJWTToken(token);

    return generatePolicy(id, event.methodArn);
};

export const handler = auth;
