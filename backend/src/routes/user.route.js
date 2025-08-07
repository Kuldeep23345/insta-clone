import express from "express"
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js"
import { isAuth } from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/:id/profile").get(isAuth,getProfile)
router.route("/profile/edit").post(isAuth,upload.single("profilePicture"),editProfile)
router.route("/suggested").get(isAuth,getSuggestedUsers)
router.route("/followorunfollow/:id").post(isAuth,followOrUnfollow)




export default router