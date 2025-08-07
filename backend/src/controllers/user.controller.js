import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

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
      .status(200)
      .json({ message: "Account created successfully", success: true ,user });
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
      return res.status(400).json({ message: "All fields are required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect email or password" });
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
      maxAge: 1*24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: `Welcome back ${user.username}`,
      success: true
      ,user
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
      .cookie("token", "").status(200)
      .json({ message: "logout successfully", success: true  });
  } catch (error) {
    console.log("logout error", error);
    res.status(400).json({ message: "logout internval error" });
  }
};
// get profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");
    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.log("Error from get profile", error);
    return res
      .status(500)
      .json({ message: "Internal error from getProfile", success: false });
  }
};
//edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;
    await user.save();
    return res.status(200).json({ message: "Profile updated", success: true ,user });
  } catch (error) {
    console.log("Error from edit Profile", error);
    return res
      .status(500)
      .json({ message: "Internal error from edit profile", });
  }
};
//get suggesed users
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res
        .status(400)
        .json({ message: "Currently doesn't have any user" });
    }
    return res.status(200).json({ success: true, users: suggestedUsers });
  } catch (error) {
    console.log("error from get suggested users");
    return res
      .status(500)
      .json({ message: "Internal error in suggested useres" });
  }
};
// follow or un follow
export const followOrUnfollow = async (req, res) => {
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // mai check krunga ki follow krna hai ya unfollow
        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}
