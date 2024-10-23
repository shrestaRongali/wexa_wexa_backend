import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
/**
 * Middleware to require user authentication.
 *
 * @param {Request} req - Express Request object. Contains client request information.
 * @param {Response} res - Express Response object. Used to send the server's response.
 * @param {NextFunction} next - Express NextFunction. Passes control to the next middleware or route.
 * @throws {NotAuthorizedError} If the user is not authenticated.
 */
export let upload = multer({
	limits: {
		fileSize: 1024 * 1024 * 10,
	},
	fileFilter: function (req: Request, file: any, done: any) {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "text/csv"
	) {
		done(null, true);
	} else {
		//prevent the upload
		var newError = new Error("File type is incorrect");
		newError.name = "MulterError";
		done(newError, false);
		
	}
	},
});