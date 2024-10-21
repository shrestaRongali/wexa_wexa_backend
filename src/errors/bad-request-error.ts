import { CustomError } from '@AppErrors/custom-error';

/**
 * Represents a BadRequestError, a custom error class that extends CustomError.
 * This error is typically used to indicate that a client's request is malformed or invalid.
 */
export class BadRequestError extends CustomError {
	/**
	 * The HTTP status code for a BadRequestError is 400 (Bad Request).
	 */
	statusCode = 400;

	/**
	 * Create a new instance of the BadRequestError.
	 * @param {string} message - A descriptive error message providing details about the bad request.
	 */
	constructor(public message: string) {
		super(message);

		// Ensure that the prototype chain is properly set up
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	/**
	 * Serialize the error message into an array of error objects.
	 * @returns {Array<{ message: string }>} An array containing a single error object with the error message.
	 */
	serializeErrors() {
		return [{ message: this.message }];
	}
}
