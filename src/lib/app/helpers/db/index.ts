import { Sequelize, Dialect } from "sequelize";


import { BaseApp } from "@AppLib/app/baseApp";
import { BaseHelper } from "@AppLib/app/helperBaseClass";

/**
 * A helper class for managing database connections and models.
 * @author Chetan Upreti
 */
export class DB<T extends { initModel: (sequelize: Sequelize) => any }> extends BaseHelper {
	/**
	 * Creates an instance of the DB helper.
	 * @param {BaseApp} _appObj - The BaseApp instance.
	 */
	constructor(_appObj: BaseApp, private modelModules: T[]) {
		super(_appObj);
	}

	/**
	 * Initializes the DB helper by establishing a Sequelize connection and registering models.
	 */
	async initialize() {
		await this.initializeSequelize();
	}

	/**
	 * Initializes the Sequelize connection and registers models.
	 */
	async initializeSequelize() {
		try {
				const dialect: Dialect = 'mysql';

				const sequelizeProps = {
					host: process.env.SERVERLESS_DB_HOST_URL!,
					port: +process.env.SERVERLESS_DB_HOST_PORT!,
					dialect: dialect,
					logging: true,
					enableArithAbort: true,
					useUTC: true,
					write: { host: process.env.SERVERLESS_DB_HOST_URL! },
					define: {
						// Prevent Sequelize from pluralizing table names
						freezeTableName: true,
						timestamps: false,
					},
				};

				try {
					const sequelize = new Sequelize(
						process.env.DB!,
						process.env.SERVERLESS_DB_USERNAME!,
						process.env.SERVERLESS_DB_PASSWORD!,
						sequelizeProps
					);

					this._appObj.dBObject = sequelize;
					await sequelize.authenticate();

					this._registerModels(sequelize);

					console.log('MySQL connection has been established successfully.');
				} catch (error) {
					console.error('Unable to connect to the database:', error);
				}
		} catch (error) {
			throw error;
		}
	}

	/**
	 * Registers models by loading them from files in the specified directory.
	 * @param {Sequelize} sequelize - The Sequelize instance.
	 * @private
	 */
	private _registerModels(sequelize: Sequelize) {
		for (const modelModule of this.modelModules) {
			const { initModel } = modelModule;
			const modelInit = initModel(sequelize);
			const modelName = modelInit.name;
			this._appObj.models[modelName] = modelInit;
		}
		console.log(`this._appObj.models`, this._appObj.models);
	}
}


