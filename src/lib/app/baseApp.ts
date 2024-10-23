import { Express } from "express";
import { SecretsManagerClient, GetSecretValueCommandOutput } from "@aws-sdk/client-secrets-manager";
import { Sequelize } from "sequelize";
import { RedisClientType } from "redis";
import { SNSClient } from '@aws-sdk/client-sns';

import { DB } from "../app/helpers/db";
import { Redis } from "../app/helpers/redis";
import { appGlobalVariablesConfigLoader, GlobalVariablesInterface } from "@AppGlobals/variables";
// import { appGlobalFunctionsConfigLoader, GlobalFunctionsInterface } from "@AppGlobals/function";

import { initUserModel } from "@AppModels/app/users";
import { initUserOtpModel } from "@AppModels/app/user_otps";
import { initCTImagesModel } from "@AppModels/app/ct_images";
import { initRequestsModel } from "@AppModels/app/requests";
import { initChatsModel } from "@AppModels/app/chats";

import { AWSS3 } from "./helpers/awsS3";
import { AWSSNS } from "./helpers/awsSns";

// Define your model modules
const modelModules = [
	{ initModel: initUserModel },
	{ initModel: initUserOtpModel },
	{ initModel: initCTImagesModel},
	{ initModel: initRequestsModel},
	{ initModel: initChatsModel},
];
/**
 * A collection of helper classes and objects for the application.
 */
export interface Helpers {
	DB_CLASS_OBJ: DB<any>;
	AWSS3_CLASS_OBJ: AWSS3;
	AWSSNS_CLASS_OBJ: AWSSNS;
	CACHE_CLASS_OBJ: Redis;
}

/**
 * The base application class.
 */
export class BaseApp {
	/**
	 * The Express application instance.
	 */
	public app: Express;

	/**
	 * The current NODE_ENV (e.g., 'local', 'staging', or undefined for production).
	 */
	public NODE_ENV: string | undefined;

	/**
	 * Helper classes and objects for the application.
	 */
	public helpers: Helpers | undefined;

	/**
	 * Models for the application.
	 */
	public models: any;

	/**
	 * AWS S3 Object (not defined in your code).
	 */
	public awsS3Obj: any | undefined;

	/**
	 * Global variables for the application.
	 */
	public globalVariables: GlobalVariablesInterface;

	/**
	 * Sequelize database object.
	 */
	public dBObject: Sequelize | undefined;

	public awsSNSObj: SNSClient | undefined;

	/**
	 * Redis cache client object.
	 */
	public cacheObject: RedisClientType | undefined;

	/**
	 * JWT secret value retrieved from AWS Secrets Manager.
	 */
	public JWT_SECRET_VALUE: GetSecretValueCommandOutput | undefined;

	/**
	 * Constructs a new BaseApp instance.
	 * @param {Express} appObj - The Express application instance.
	 */
	constructor(appObj: Express) {
		this.app = appObj;
		this.models = {};

		// Set NODE_ENV variable.
		this.NODE_ENV = process.env.NODE_ENV;
		this.globalVariables = appGlobalVariablesConfigLoader(this);
	}

	/**
	 * Initializes the base application by loading helper classes.
	 */
	async initialize() {
		await this.loadAppHelperClasses();
	}

	/**
	 * Load all helper classes and create their objects and put them in the helpers property.
	 */
	async loadAppHelperClasses() {
		this.helpers = {} as Helpers;

		//load AWS S3 helper
		this.helpers.AWSS3_CLASS_OBJ = new AWSS3(this);
		await this.helpers.AWSS3_CLASS_OBJ.initialize().catch(error => {
			throw error;
		})

		// Load Redis Cache helper.
		this.helpers.CACHE_CLASS_OBJ = new Redis(this);
		await this.helpers.CACHE_CLASS_OBJ.initialize().catch((error: any) => {
			throw error;
		});

		// Load DB helper.
		this.helpers.DB_CLASS_OBJ = new DB(this, modelModules);
		await this.helpers.DB_CLASS_OBJ.initialize().catch((error) => {
			throw error;
		});

		// Load SNS Cache helper.
		this.helpers.AWSSNS_CLASS_OBJ = new AWSSNS(this);
		await this.helpers.AWSSNS_CLASS_OBJ.initialize().catch((error: any) => {
			throw error;
		});
	}
}
