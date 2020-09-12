import jwt from "jsonwebtoken";

const getUserFromJWTToken = async (token) => {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token.replace("Bearer ", ""), secret);
};

export default getUserFromJWTToken;
