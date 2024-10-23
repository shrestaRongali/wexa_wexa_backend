/**
 * Abstract base class for custom error handling in the application.
 * Extends the built-in Error class to provide a common structure for custom errors.
 */
export abstract class CustomError extends Error {
	/**
	 * The HTTP status code associated with the error.
	 */
	abstract statusCode: number;

	/**
	 * Create a new instance of a custom error.
	 * @param {string} message - A descriptive error message providing details about the error.
	 */
	constructor(message: string) {
		super(message);

		// Ensure that the prototype chain is properly set up
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	/**
	 * Abstract method for serializing the error into an array of error objects.
	 * @returns {Array<{ message: string, field?: string }>} An array containing error objects with error messages and optional field information.
	 */
	abstract serializeErrors(): { message: string, field?: string }[];
}
