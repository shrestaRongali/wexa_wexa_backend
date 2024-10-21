import express, { Request, Response, NextFunction } from "express";
import { body, oneOf } from "express-validator";

import { currentUser } from "@AppMiddleWares/current-user";
import { requireAuth } from "@AppMiddleWares/require-auth";

import { UserController } from "@AppControllers/userController";
import * as userValidation from "../validations/userValidation";
import validate from "../modules/validate/validate.middleware";
import { upload } from "@AppMiddleWares/upload-files";


let multer = require("multer");

const router = express.Router();

//get user details
router.get(
	"/user",
    currentUser,
    requireAuth,
	getUserDetails
);

async function getUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.getUserDetails();
}

//get user details
router.patch(
	"/user",
    currentUser,
    requireAuth,
	upload.array('files', 1),
	validate(userValidation.updateProfile),
	updateUserDetails
);

async function updateUserDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.updateUserDetails();
}

//send Friend Request
router.post(
	"/request",
    currentUser,
    requireAuth,
	validate(userValidation.sendRequest),
	sendRequest
);

async function sendRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.sendRequest();
}

//Accept Friend Request
router.patch(
	"/request",
    currentUser,
    requireAuth,
	validate(userValidation.acceptRequest),
	acceptRequest
);

async function acceptRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.acceptRequest();
}

//get Friend List
router.get(
	"/friends",
    currentUser,
    requireAuth,
	getFriends
);

async function getFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.getFriends();
}

//send Message
router.post(
	"/chat",
    currentUser,
    requireAuth,
	validate(userValidation.sendChat),
	sendChat
);

async function sendChat(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.sendChat();
}

router.get(
	"/chat",
    currentUser,
    requireAuth,
	validate(userValidation.getChat),
	getChat
);

async function getChat(req: Request, res: Response, next: NextFunction): Promise<void> {
	const userController = new UserController(req, res, next);
	await userController.getChat();
}







export { router as userRouter };
