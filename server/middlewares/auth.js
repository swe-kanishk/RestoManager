import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    let token =
      req?.cookies?.accessToken || req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      token = req?.query?.token;
    }
    if (!token) {
      return res.status(401).json({
        message: "Provide token",
      });
    }
    let decoded;
    try {
      decoded = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid authentication token",
        error: true,
        success: false,
      });
    }
    req.userId = decoded._id;
    next();
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "You haven't login!",
      error: true,
      success: false,
    });
  }
};

export default auth;
