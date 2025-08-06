import express from "express"
import { editProfile, followOrUnFollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js"
import { isAuth } from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/:id/profile").get(isAuth,getProfile)
router.route("/profile/edit").post(isAuth,upload.single("profilePictrue"),editProfile)
router.route("/suggested").get(isAuth,getSuggestedUsers)
router.route("/followorunfollow/:id").post(isAuth,followOrUnFollow)



router.route("/logout").post(logout)
export default router