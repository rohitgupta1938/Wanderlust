import express from "express";
const router = express.Router();
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";

router.get("/signup", (req, res) => {
  res.render("./user/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser,(err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "User was registred!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("./user/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome Back to wanderlust!");
    let redirectUrl=res.locals.redirectUrl ? res.locals.redirectUrl: "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logout!");
    res.redirect("/listings");
  });
});
export default router;
