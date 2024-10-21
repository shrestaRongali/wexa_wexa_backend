/**
 * A TypeScript module that provides a configuration loader for app-global functions.
 * This module defines a set of functions for handling and detecting app-specific errors.
 * @module appGlobalFunctionsConfigLoader
 */

import { BaseApp } from "../lib/app/baseApp";

/**
 * Interface for global functions that may be used throughout the application.
 * These functions provide error handling and validation capabilities.
 */
export interface GlobalFunctionsInterface {
	/**
	 * Check if an error is of type LocalApiError, which typically has a string message.
	 * @param {any} err - The error to check.
	 * @returns {err is LocalApiError} A boolean indicating whether the error is of type LocalApiError.
	 */
	isLocalApiError: (err: any) => err is LocalApiError;
}

/**
 * Interface representing a local API error.
 */
interface LocalApiError {
	message: string;
}

/**
 * Function for loading global functions configuration.
 * @param {BaseApp} appObj - The application object used for configuration.
 * @returns {GlobalFunctionsInterface} An object containing global functions for error handling and validation.
 */
function configLoader(appObj: BaseApp): GlobalFunctionsInterface {
	return {
		/**
		 * Check if an error is of type LocalApiError.
		 * @param {any} err - The error to check.
		 * @returns {err is LocalApiError} A boolean indicating whether the error is of type LocalApiError.
		 */
		isLocalApiError: (err: any): err is LocalApiError => {
			return typeof err.message === 'string';
		}
	};
}

// export { configLoader as appGlobalFunctionsConfigLoader };
