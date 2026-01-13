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
import listings from "./router/listings.js";
import reviews from "./router/reviews.js";
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
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const sessionOption={
  secret:"mysupersecret",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*60*1000,
    maxAge:7*24*60*60*60*1000,
    httpOnly:true
  }
}
app.use(session(sessionOption))
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.get("/", (req, res) => {
  res.send("Get Request is working");
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