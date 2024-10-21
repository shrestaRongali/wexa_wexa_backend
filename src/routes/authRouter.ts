import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "@AppControllers/authController";
import * as authValidation  from "../validations/authValidation";
import validate from "../modules/validate/validate.middleware";


let multer = require("multer");

const router = express.Router();

//signup
router.post(
	"/signup",
	validate(authValidation.signup),
	signup
);

async function signup(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authController = new AuthController(req, res, next);
	await authController.signup();
}

//send signup otp
router.post(
	"/signup/otp",
	validate(authValidation.sendSignupOtp),
	sendSignupOtp
);

async function sendSignupOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authController = new AuthController(req, res, next);
	await authController.sendSignupOtp();
}

//login
router.post(
	"/login",
	validate(authValidation.login),
	login
);

async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authController = new AuthController(req, res, next);
	await authController.login();
}

export { router as authRouter };
