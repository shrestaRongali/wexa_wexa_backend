import { Request, Response, NextFunction } from "express";
import { CustomError } from "@AppErrors/custom-error";

/**
 * Express middleware for handling errors.
 * @param {Error} err - The error object to be handled.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	/**
	* Handle errors of type CustomError.
	*/
	if (err instanceof CustomError) {
		return res.status(err.statusCode).send({ errors: err.serializeErrors() });
	}
	console.log(err);
	// Send a generic error response when the error is not of type CustomError.
	res.status(400).send({
		errors: [{ message: "Something went wrong" }],
	});
}