import { CustomError } from '@AppErrors/custom-error';

/**
 * Represents a NotAuthorizedError, a custom error class that extends CustomError.
 * This error is used to indicate that a user or client is not authorized to perform a certain action.
 */
export class NotAuthorizedError extends CustomError {
	/**
	 * The HTTP status code for a NotAuthorizedError is 401 (Unauthorized).
	 */
	statusCode = 401;

	/**
	 * Create a new instance of the NotAuthorizedError.
	 */
	constructor() {
		super('Not Authorized');

		// Ensure that the prototype chain is properly set up
		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}

	/**
	 * Serialize the error message into an array of error objects.
	 * @returns {Array<{ message: string }>} An array containing a single error object with the message 'Not authorized'.
	 */
	serializeErrors() {
		return [{ message: 'Not authorized' }];
	}
}

