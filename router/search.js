import express from "express";
const router = express.Router();
import searchController from '../controller/search.js';
import wrapAsync from "../utils/wrapAsync.js";


router.get("/",wrapAsync(searchController));

export default router;
