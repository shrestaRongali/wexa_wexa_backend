import { CustomError } from '@AppErrors/custom-error';
import { error } from 'console';

/**
 * Represents a NotFoundError, a custom error class that extends CustomError.
 * This error is used to indicate that the requested route or resource was not found.
 */
export class NotFoundError extends CustomError {
	/**
	 * The HTTP status code for a NotFoundError is 404 (Not Found).
	 */
	statusCode = 404;

	/**
	 * Create a new instance of the NotFoundError.
	 */
	constructor() {
		super("Route not found");

		// Ensure that the prototype chain is properly set up
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

	/**
	 * Serialize the error message into an array of error objects.
	 * @returns {Array<{ message: string }>} An array containing a single error object with the message 'Not Found'.
	 */
	serializeErrors() {
		return [{ message: "Not Found" }];
	}
}
