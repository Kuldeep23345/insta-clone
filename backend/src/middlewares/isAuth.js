import jwt from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
  try {
    const token = await req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Invalid", success: false });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log("Error from isAuth middleware", error);
    return res
      .status(500)
      .json({
        message: "Internal error from is authmiddleware",
        success: false,
      });
  }
};
