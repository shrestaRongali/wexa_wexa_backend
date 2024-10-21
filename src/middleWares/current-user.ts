import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
	id: number
	email: string;
	phone: string;
	name: string;
}

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload;
		}
	}
}

/**
 * Middleware to check if a user is authenticated.
 *
 * @param {Request} req - Express Request object. Contains client request information.
 * @param {Response} res - Express Response object. Used to send the server's response.
 * @param {NextFunction} next - Express NextFunction. Passes control to the next middleware or route.
 * @returns {Promise<void>}
 */
export const currentUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const JWT_TOKEN = process.env.JWT_TOKEN_SECRET;
		let session = req.headers['key'];
		const token = await EXPRS.cacheObject?.get(`univerze_auth:${session}`);
		if (!JWT_TOKEN || !session || !token) {
			return next();
		}
		const payload = jwt.verify(token, JWT_TOKEN) as any;
		req.currentUser = {
			...payload,
		}
			;
		return next();
	} catch (error) {
		return next();
	}
};
