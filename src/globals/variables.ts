/**
 * A TypeScript module that provides a configuration loader for app-global variables.
 * @module appGlobalVariablesConfigLoader
 */
import crypto from 'crypto';
import { BaseApp } from "../lib/app/baseApp";

/**
 * Interface for global variables used throughout the application.
 */
export interface GlobalVariablesInterface {
	/**
	 * The port on which the application should listen for incoming requests.
	 */
	
	/**
	 * The version of the API being used by the application.
	*/
	API_VERSION: string;
	
	/**
	 * The HMAC algorithm for data hashing.
	*/
	HMAC_ALGORITHM: string;
	
	/**
	 * The HMAC salt for data hashing.
	*/
	HMAC_SALT: string;
	
	/**
	 * The name of the Express CDN bucket.
	*/
	EXPRS_CDN_BUCKET: string;
	
	/**
	 * The name of the Express CDN URL.
	*/
	EXPRS_CDN_URL: string;
	
	DEFAULT_FROM_EMAIL_NAME: string;
	
	DEFAULT_FROM_EMAIL: string;
	
	WEBSITE_URL: string;
	
	APP_PORT: number;
	
	ENCRYPTION_KEY: string;

	SUML_URL:string;

	OTP_EXPIRY_TIME: number;

	QR_CODE_BASE_URL_SVG: string;

	QR_CODE_BASE_URL_PNG: string;

}

/**
 * Function for loading global variables configuration.
 * @param {BaseApp} appObj - The application object used for configuration.
 * @returns {GlobalVariablesInterface} An object containing global variables for the application.
 */
function configLoader(appObj: BaseApp): GlobalVariablesInterface {
	return {
		API_VERSION: 'v1',
		HMAC_ALGORITHM: 'SHA-1',
		HMAC_SALT: 'tE5mQ8nydZhc4BFd5Tj4',
		EXPRS_CDN_BUCKET: 'shrfirstbucket',
		EXPRS_CDN_URL: 'https://shrfirstbucket.s3.eu-north-1.amazonaws.com/',
		DEFAULT_FROM_EMAIL_NAME: 'Univerze',
		DEFAULT_FROM_EMAIL: 'tech@univerze.ai',
		WEBSITE_URL: appObj.NODE_ENV === 'local' ? 'http://localhost:6001/' : appObj.NODE_ENV === `development` ? `https://assets.monetez.com/` : `https://www.univerze.com/`,
		APP_PORT: appObj.NODE_ENV === 'local' ? 6001 : appObj.NODE_ENV === `development` ? 6001 : 6002,
		ENCRYPTION_KEY: "0fc9c70aa4ba1d7fc12f0495b0867d002f424f7f088cd0e2691e8b654c94e406",
		SUML_URL: appObj.NODE_ENV === 'local' ? 'http://localhost:3000/' : appObj.NODE_ENV === `development` ? `https://suml.monetez.com/` : `https://cc.univerze.com/`,
		OTP_EXPIRY_TIME: 300,
		QR_CODE_BASE_URL_SVG: "https://qr-codes-svg.s3.amazonaws.com/",
		QR_CODE_BASE_URL_PNG: "https://qr-codes-png.s3.amazonaws.com/"
	};
}

export { configLoader as appGlobalVariablesConfigLoader };
