import { BaseApp } from "@AppLib/app/baseApp";
import { SNSClient } from '@aws-sdk/client-sns';
import { awsSNSConfigLoader } from "@AppConfigs/index";
import { BaseHelper } from "@AppLib/app/helperBaseClass";

/**
 * Manages the AWS S3 client for the application.
 */
export class AWSSNS extends BaseHelper {
	private _configs = awsSNSConfigLoader();

	/**
	 * Creates an instance of the AWSS3 class.
	 *
	 * @param {BaseApp} _appObj - The application object.
	 */
	constructor(_appObj: BaseApp) {
		super(_appObj);
	}

	/**
	 * Initializes the AWS S3 client.
	 *
	 * @throws {Error} If there is an error during initialization.
	 */
	async initialize(): Promise<void> {
		await this.initializeAWS_SNS();
	}

	/**
	 * Initializes the AWS S3 client with the specified AWS region.
	 */
	async initializeAWS_SNS(): Promise<void> {
		try {
			const snsClient = new SNSClient({ region: this._configs.region, credentials: {
				accessKeyId: process.env.S3_CLIENT_ACCESS_KEY_ID!,
				secretAccessKey: process.env.S3_CLIENT_SECRET_ACCESS_KEY!
			} });
			EXPRS.awsSNSObj = snsClient;
		} catch (error) {
			throw error;
		}
	}
}
