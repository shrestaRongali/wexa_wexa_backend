import { BaseApp } from "@AppLib/app/baseApp";
import { S3Client } from "@aws-sdk/client-s3";
import { awsS3ConfigLoader } from "@AppConfigs/index";
import { BaseHelper } from "../../helperBaseClass";

/**
 * Manages the AWS S3 client for the application.
 */
export class AWSS3 extends BaseHelper {
	private _configs = awsS3ConfigLoader();

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
		await this.initializeAWS_S3();
	}

	/**
	 * Initializes the AWS S3 client with the specified AWS region.
	 */
	async initializeAWS_S3(): Promise<void> {
		try {
			const s3Client = new S3Client({ region: this._configs.region, credentials: {
				accessKeyId: process.env.S3_CLIENT_ACCESS_KEY_ID!,
				secretAccessKey: process.env.S3_CLIENT_SECRET_ACCESS_KEY!
			} });
			EXPRS.awsS3Obj = s3Client;
		} catch (error) {
			throw error;
		}
	}
}
