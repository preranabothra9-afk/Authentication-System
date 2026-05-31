import express from "express";
import { registerUser, loginUser, getProfile, refreshAccessToken, logoutUser } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { authenticate } from "../middlewares/auth.middlware.js";


const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/profile", authenticate, getProfile);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);


export default router;