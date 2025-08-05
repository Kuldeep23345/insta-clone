import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res
        .status(400)
        .json({ message: "User already existed with this email" });
    }
    const user = await User.create({
      username,
      email,
      password,
    });
    res
      .status(201)
      .json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.log("login error", error);
    res.status(500).json({ message: "Internal login failed", success: false });
  }
};
// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      bookmarks: user.bookmarks,
    };
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: `Welcome back ${user.username}`,
      success: true,
    });
  } catch (error) {
    console.log("Login error", error);
    res.status(500).json({ message: "login internal", success: false });
  }
};
//logout
export const logout = async function (req, res) {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "logout successfully", success: true });
  } catch (error) {
    console.log("logout error", error);
    res.status(401).json({ message: "logout internval error" });
  }
};
// get profile
