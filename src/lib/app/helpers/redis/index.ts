import { createClient, RedisClientType } from "redis";
import { BaseApp } from "@AppLib/app/baseApp";
import { BaseHelper } from "@AppLib/app/helperBaseClass";

/**
 * Represents a Redis helper class for managing Redis cache connections.
 * @extends BaseHelper
 */
export class Redis extends BaseHelper {
	/**
	 * Creates an instance of the Redis helper class.
	 * @param {BaseApp} _appObj - The BaseApp instance.
	 */
	constructor(_appObj: BaseApp) {
		super(_appObj);
	}

	/**
	 * Initializes the Redis cache connection.
	 * @async
	 */
	async initialize() {
		await this.initializeAuthCache();
	}

	/**
	 * Initializes the Redis cache with the provided configuration.
	 * @async
	 * @throws {Error} Throws an error if initialization fails.
	 */
	async initializeAuthCache() {
		try {
				const host = process.env.REDIS_HOST_URL;
				const port = process.env.REDIS_PORT;
				const database = process.env.UNIVERZE_REDIS_DATABASE!;
				console.log("foihuegio8ieukfj")

				if (host && port) {
					let _cache: RedisClientType = createClient({
						password: '4TNhofGtmnJ8bH7MX9JMjOasFF7axHkX',
						socket: {
							host: 'redis-15821.c309.us-east-2-1.ec2.redns.redis-cloud.com',
							port: 15821
						}
					});;

					console.log("Redis port is", database);

					await _cache.connect()
						.then(() => console.log(`Redis connection has been established successfully`))
						.catch((error: any) => console.log(`Something went wrong ${error}`));

					this._appObj.cacheObject = _cache;
				}
		} catch (error) {
			console.error(error);
			throw error;
		}
	}
}
