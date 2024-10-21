import { ValidationError } from "express-validator";
import { CustomError } from '@AppErrors/custom-error';

/**
 * Represents a RequestValidationError, a custom error class that extends CustomError.
 * This error is used to indicate validation errors in the request parameters.
 */
export class RequestValidationError extends CustomError {
	/**
	 * The HTTP status code for a RequestValidationError is 400 (Bad Request).
	 */
	statusCode = 400;

	/**
	 * Create a new instance of the RequestValidationError.
	 * @param {ValidationError[]} errors - An array of validation errors providing details about the invalid request parameters.
	 */
	constructor(public errors: ValidationError[]) {
		super("Invalid request parameters");

		// Ensure that the prototype chain is properly set up
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	/**
	 * Serialize the validation errors into an array of error objects.
	 * @returns {Array<{ message: string, type: string }>} An array of error objects, each containing the error message and the associated type name.
	 */
	serializeErrors() {
		return this.errors.map((err): any => {
			return { message: err.msg , type: err.type};
		});
	}
}
