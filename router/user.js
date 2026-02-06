import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import {userController} from '../controller/user.js';

// signup page
router.get("/signup",userController.renderSignupPage);;

// create account
router.post("/signup",wrapAsync(userController.signupUser));

//login page
router.get("/login",userController.loginPage );

// login user
router.post("/login", saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/wanderlust/signup",failureFlash: true}),userController.loginUser);

router.get("/logout", userController.logoutUser);
export default router;
