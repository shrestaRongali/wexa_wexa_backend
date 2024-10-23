import moment from "moment";

import { BaseApp } from "../lib/app/baseApp";
import { Request, Response, NextFunction } from "express";
import { GlobalService } from "@AppServices/db/globalService";
import { User } from "@AppModels/app";
import { SessionDetails } from "@AppServices/defaultService";

type ResponseObj = {
	success: boolean;
	message: string;
	data: any;
};

/**
 * Represents a base controller class for handling HTTP requests and responses in an Express.js application.
 */
export class DefaultController {
	private _request: Request;
	private _response: Response;
	private _nextFunction: NextFunction;
	private _statusCode: number = 200;
	private _data: any[] = [];
	private _message: string = '';
	private _success: boolean = true;
	private _appObj: BaseApp;

	protected _globalService: GlobalService;

	/**
	 * Creates an instance of DefaultController.
	 * @param {Request} request - The Express.js request object.
	 * @param {Response} response - The Express.js response object.
	 * @param {NextFunction} next - The Express.js next function.
	 */
	constructor(request: Request, response: Response, next: NextFunction) {
		this._request = request;
		this._response = response;
		this._nextFunction = next;
		// Replace 'EXPRS' with the actual app object.
		this._appObj = EXPRS;
		this._globalService = new GlobalService();
	}

	/**
	 * Get the application object associated with this controller.
	 * @returns {BaseApp} The application object.
	 */
	getAppObj(): BaseApp {
		return this._appObj;
	}

	/**
	 * Get the response object associated with this controller.
	 * @returns {Response} The Express.js response object.
	 */
	getResponseObj(): Response {
		return this._response;
	}

	/**
	 * Get the request object associated with this controller.
	 * @returns {Request} The Express.js request object.
	 */
	getRequestObj(): Request {
		return this._request;
	}

	/**
	 * Get the next function associated with this controller.
	 * @returns {NextFunction} The Express.js next function.
	 */
	getNextFunction(): NextFunction {
		return this._nextFunction;
	}

	/**
	 * Set the HTTP status code to be sent in the response.
	 * @param {number} statusCode - The HTTP status code.
	 */
	setStatusCode(statusCode: number): void {
		this._statusCode = statusCode;
	}

	/**
	 * Send the response to the client with the configured status code and data.
	 */
	async sendResponse(): Promise<void> {
		const response = await this.sendJsonResponse();
		this._response.status(this._statusCode).send(response);
	}

	/**
	 * Assemble and return a JSON response object.
	 * @returns {ResponseObj} A response object containing success status, a message, and data.
	 */
	async sendJsonResponse(): Promise<ResponseObj> {
		const resObj: ResponseObj = {
			success: this._success,
			message: this._message,
			data: this._data || []
		};
		return resObj;
	}

	/**
	 * Set the success status of the response.
	 * @param {boolean} isSuccess - A boolean indicating the success of the response.
	 */
	setSuccess(isSuccess: boolean): void {
		this._success = isSuccess;
	}

	/**
	 * Set the message to be included in the response.
	 * @param {string} message - A string message.
	 */
	setMessage(message: string): void {
		this._message = message;
	}

	/**
	 * Set the response data to be included in the response.
	 * @param {any} data - The response data, which can be of any type.
	 */
	setResponseData(data: any): void {
		this._data = data;
	}

	/**
	 * Encrypt a value. Note: This method does not perform any encryption, and it's not clear how it's intended to be used.
	 * @param {any} value - The value to be "encrypted."
	 * @returns {any} The original value.
	 */
	encrypt(value: any): any {
		if (value === undefined) {
			return value;
		}
		value = JSON.stringify(value);
		return value;
	}

	/**
	 * Generates a session token for the user.
	 *
	 * @param {string} email - User's email address.
	 * @returns {string} The generated session token.
	 */
	generateSession(email: string): string {
		return this._globalService.generateHmac(JSON.stringify({
			email: email,
			timestamp: moment().unix()
		}), false, null);
	}

	/**
	 * Stores the session token in the cache.
	 *
	 * @param {string} session - Session token.
	 * @param {string} token - User token.
	 * @returns {Promise<void>} Resolves when the token is stored successfully.
	 */
	async storeSessionToken(session: string, token: string): Promise<void> {
		await this.getAppObj().cacheObject?.set(`univerze_auth:${session}`, token);
	}

	/**
	 * Generates a user token for the user.
	 * @param {User} user - User object.
	 * @param {string} session - Session token.
	 * @returns {SessionDetails} The generated user token.
	 */
	generateUserToken(
		user: Partial<User>,
		session: string
	): SessionDetails {
		return this._globalService.generateUserToken(
			{
				email: user.email,
				phone: user.phone,
				id: user.id,
				name: user.name,
				session,
			},
			'12h'
		);
	}

	generateRandomString(length: number = 5): string {
		const characters = {
			lowercase: 'abcdefghijklmnopqrstuvwxyz',
			uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			numbers: '123456789'
		};

		if (length === 1) {
			const randomSet = Math.floor(Math.random() * 3); 
			
			if (randomSet === 0) {
				return characters.lowercase.charAt(Math.floor(Math.random() * characters.lowercase.length));
			} else if (randomSet === 1) {
				return characters.uppercase.charAt(Math.floor(Math.random() * characters.uppercase.length));
			} else {
				return characters.numbers.charAt(Math.floor(Math.random() * characters.numbers.length));
			}
		}

		let result = '';

		// Add at least one character from each range
		result += characters.lowercase.charAt(Math.floor(Math.random() * characters.lowercase.length));
		result += characters.uppercase.charAt(Math.floor(Math.random() * characters.uppercase.length));
		result += characters.numbers.charAt(Math.floor(Math.random() * characters.numbers.length));

		// Generate the remaining characters
		for (let i = result.length; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.lowercase.length);
			result += characters.lowercase.charAt(randomIndex);
		}

		// Shuffle the result string to randomize the order
		result = result.split('').sort(() => Math.random() - 0.5).join('');

		return result;
	}
}
