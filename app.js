import "dotenv/config";
if (process.env.NODE_ENV != "production") {
  console.log(process.env.SECRET_KEY);
}

import express from "express";
import mongoose from "mongoose";
import path from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import "@tailwindplus/elements";
import ExpressError from "./utils/ExpressError.js";
import listingRout from "./router/listings.js";
import reviewRout from "./router/review.js";
import userRout from "./router/user.js";
import homeRout from "./router/home.js";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "./models/user.js";
import Listing from "./models/listing.js";
const app = express();

// ES Module me __dirname banane ka tarika
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main()
  .then((response) => {
    console.log("DB id Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOption = {
  secret: "mysupersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      // User not found
      if (!user) {
        return done(null, false, {
          message: "Account does not exist",
        });
      }

      // Password check
      const isValid = await user.authenticate(password);
      if (!isValid.user) {
        return done(null, false, {
          message: "Incorrect password",
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.ReqUser = req.user;
  next();
});

app.use("/wanderlust/listings", listingRout);
app.use("/wanderlust/listings/:id/reviews", reviewRout);
app.use("/wanderlust", userRout);
app.use("/wanderlust", homeRout);

app.get("/filter", async (req, res) => {
  let filterValue = req.query.q.toLocaleLowerCase();
  let allListings = await Listing.find({});
  allListings = allListings.filter((listing) => {
    let title = listing.title.toLocaleLowerCase();
    let description = listing.description.toLocaleLowerCase();
    let country = listing.country.toLocaleLowerCase();
    let location = listing.location.toLocaleLowerCase();
    if (
      title.includes(filterValue) ||
      description.includes(filterValue) ||
      location.includes(filterValue) ||
      country.includes(filterValue)
    ) {
      return listing;
    }
  });
  console.log(allListings)
  res.render("listing/index.ejs", { allListings });
});

//404 handler — matches ALL unknown routes
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "something went wrong" } = err;
  res.status(statusCode).render("./error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server is working on port : 8080");
});
