import express from "express";
const router = express.Router();
import wrapAsync from "../utils/wrapAsync.js";
import {HomePageController} from '../controller/home.js'
router.get("/",wrapAsync(HomePageController));

export default router;