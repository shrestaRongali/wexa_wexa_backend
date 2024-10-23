import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '@AppErrors/not-authorized-error';

/**
 * Middleware to require user authentication.
 *
 * @param {Request} req - Express Request object. Contains client request information.
 * @param {Response} res - Express Response object. Used to send the server's response.
 * @param {NextFunction} next - Express NextFunction. Passes control to the next middleware or route.
 * @throws {NotAuthorizedError} If the user is not authenticated.
 */
export const requireAuth = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	if (!req.currentUser) {
		throw new NotAuthorizedError();
	}

	next();
};
