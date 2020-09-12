import jwt from "jsonwebtoken";

const getUserFromJWTToken = async (token) => {
    return jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
};

export default getUserFromJWTToken;
