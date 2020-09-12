import jwt from "jsonwebtoken";

const signToken = async (user) => {
  const payload = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 });
  return { token };
};

export default signToken;
