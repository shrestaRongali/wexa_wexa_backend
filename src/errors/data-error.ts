import { CustomError } from '@AppErrors/custom-error';

/**
 * Represents a DataError, a custom error class that extends CustomError.
 * This error is typically used to indicate issues with data processing or database operations.
 */
export class DataError extends CustomError {
	/**
	 * The HTTP status code for a DataError is 500 (Internal Server Error) by default.
	 */
	statusCode = 500;

	/**
	 * Create a new instance of the DataError.
	 * @param {string} message - A descriptive error message providing details about the data-related error.
	 * @param {number} [statusCode] - An optional HTTP status code to override the default status code.
	 */
	constructor(public message: string, statusCode?: number) {
		super(message);
		if (statusCode) this.statusCode = statusCode;

		// Ensure that the prototype chain is properly set up
		Object.setPrototypeOf(this, DataError.prototype);
	}

	/**
	 * Serialize the error message and status code into an array of error objects.
	 * @returns {Array<{ message: string, statusCode: number }>} An array containing a single error object with the error message and status code.
	 */
	serializeErrors() {
		return [{ message: this.message, statusCode: this.statusCode }];
	}
}
