import { Request } from "express";
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import CryptoJS from 'crypto-js';

import { BaseApp } from "@AppLib/app/baseApp";
import { User } from "@AppModels/app";

export interface SessionDetails {
	token: string;
	session: string;
}

export class DefaultService {

	private _appObj: BaseApp;

	constructor() {
		this._appObj = EXPRS;
	}



	getAppObj(): BaseApp {
		return this._appObj;
	}

	/**
	* Generates an HMAC (Hash-based Message Authentication Code) for a given content using a specified algorithm and salt.
	*
	* @param {string} string - The string to be hashed.
	* @returns {string} A promise that resolves to the generated HMAC.
	* @throws {Error} If there is an error during HMAC generation, an error with the corresponding error message is thrown.
	*/
	generateHmac(content: string, payment: boolean, salt: string | null): string {
		// if (payment) {
		// 	try {
		// 		const hmacAlgorithm = "SHA-256"
		// 		const hmacSalt = salt ? salt : EXPRS.razorpayObj.key_secret;
		// 		console.log(hmacSalt, "hmacSalt")
		// 		const hmac = crypto.createHmac(hmacAlgorithm, hmacSalt).update(content).digest('hex');
		// 		return hmac;
		// 	} catch (error: any) {
		// 		throw new Error(`Error generating HMAC: ${error.message}`);
		// 	}	
		// }
		try {
			const hmacAlgorithm = this.getAppObj().globalVariables.HMAC_ALGORITHM;
			const hmacSalt = this.getAppObj().globalVariables.HMAC_SALT;
			const hmac = crypto.createHmac(hmacAlgorithm, hmacSalt).update(content).digest('hex');
			return hmac;
		} catch (error: any) {
			throw new Error(`Error generating HMAC: ${error.message}`);
		}
	}


	/**
	 * Generates a user token with the provided user details and an optional expiration time.
	 * @param userDetails User details to be included in the token.
	 * @param expiration Expiration time for the token (default: '30d').
	 * @returns A session details object containing the generated token and user session details.
	 * @throws If there is an error during token generation, an error is thrown.
	 */
	generateUserToken(userDetails: Partial<User> & {
		session: string;
	}, expiration: string = '30d'): SessionDetails {
		try {
			const token = jwt.sign(userDetails, process.env.JWT_TOKEN_SECRET! , { expiresIn: expiration });
			const sessionDetails: SessionDetails = {
				token,
				session: userDetails.session
			};
			return sessionDetails;
		} catch (error: any) {
			throw new Error(`Error generating UserToken: ${error.message}`);
		}
	}

	/**
	  * Sends an email using the AWS SES (Simple Email Service) client.
	  *
	  * @param {string} source - The sender's email address.
	  * @param {string[]} recipients - An array of recipient email addresses.
	  * @param {string} subject - The subject of the email.
	  * @param {string} text - The plain text content of the email.
	  * @param {string} html - The HTML content of the email.
	  * @returns {Promise<void>} - Resolves when the email is sent successfully.
	  */
	async sendEmail(
		source: string,
		recipients: string[],
		subject: string,
		text: string,
		html: string,
		cc: string[] = [],
		bcc: string[] = [],
		replyTo?: string,
		from_name?: string
	): Promise<void> {
		const sender = from_name ? `"${from_name}" <${source}>` : source;
		// Define the email content
		const params = {
			Source: sender,
			Destination: {
				ToAddresses: recipients,
				CcAddresses: cc,
				BccAddresses: bcc,
			},
			Message: {
				Subject: {
					Data: subject,
				},
				Body: {
					Text: {
						Data: text,
					},
					Html: {
						Data: html,
					},
				},
			},
			ReplyToAddresses: replyTo ? [replyTo] : undefined,
			FromDisplayName: from_name,
		};

		// Send the email
		try {
			const command = new SendEmailCommand(params);
			await this.getAppObj().awsSNSObj!.send(command);
			console.log('Email sent successfully');
		} catch (error) {
			console.error('Error sending email:', error);
		}
	}

	async encrypt(data: string): Promise<string> {
		const cipherText = CryptoJS.AES.encrypt(data,EXPRS.globalVariables.ENCRYPTION_KEY).toString();
		return cipherText;
	}
	

	async decrypt(cipherText: string): Promise<string>{
		try {
			const bytes = CryptoJS.AES.decrypt(cipherText,EXPRS.globalVariables.ENCRYPTION_KEY);
			if(bytes.sigBytes > 0){
				const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
				return decryptedData;
			}else{
				throw new Error('Decryption Failed Invalid Key')
			}
		} catch (error) {
			throw new Error('Decryption Failed Invalid Key')
		}
	}

}
