import jwt from "jsonwebtoken";

export const generateAccessToken = async (adminId) => {
  return jwt.sign({ _id: adminId }, process.env.SECRET_KEY_ACCESS_TOKEN, {
    expiresIn: "5h",
  });
};

export const generateRefreshToken = async (adminId) => {
  return jwt.sign({ _id: adminId }, process.env.SECRET_KEY_REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};
