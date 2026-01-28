import User from '../models/user.js'
export const userController = {
  renderSignupPage: (req, res) => {
    res.render("./user/signup.ejs");
  },
  signupUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ username, email });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "User was registred!");
        res.redirect("/wanderlust");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/wanderlust/signup");
    }
  },
  loginPage: (req, res) => {
    res.render("./user/login.ejs");
  },
  loginUser: async (req, res) => {
    req.flash("success", "Welcome Back to wanderlust!");
    let redirectUrl = res.locals.redirectUrl
      ? res.locals.redirectUrl
      : "/wanderlust";
    res.redirect(redirectUrl);
  },
  logoutUser: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logout!");
      res.redirect("/wanderlust");
    });
  }
};
