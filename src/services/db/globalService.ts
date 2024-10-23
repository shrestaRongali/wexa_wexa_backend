import axios from 'axios';
import { Model, Transaction, WhereOptions, ModelDefined, ValidationError, FindOptions, Order, QueryTypes } from 'sequelize';
import { DefaultService } from '@AppServices/defaultService';
import { RequestValidationError } from '@AppErrors/request-validation-error';
import { ValidationError as ExpressValidationError } from "express-validator";
import { BadRequestError } from '@AppErrors/bad-request-error';
import { PublishCommand } from '@aws-sdk/client-sns';

// Define an interface that represents the attributes of your model
interface ModelAttributes {
	[key: string]: any; // Define the attributes and their types here
}

export class GlobalService extends DefaultService {

	/**
	  * Asynchronously finds a single record in the database using the specified model and criteria.
	  *
	  * @param {ModelDefined<ModelAttributes, ModelAttributes>} model - The Sequelize model to query.
	  * @param {WhereOptions<ModelAttributes>} where - The criteria to match records against.
	  * @param {Order} [order] - The order in which to retrieve the records.
	  * @param {string[]} [includeAttributes=[]] - An array of attributes to include in the result.
	  * @param {string[]} [excludeAttributes=[]] - An array of attributes to exclude from the result.
	  * @param {Transaction} [transaction] - The transaction to perform the operation in.
	  *
	  * @returns {Promise<Model<any, any> | null>} A Promise that resolves to the found record or null if not found.
	  *
	  * @throws {Error} If an error occurs during the operation.
	  * @throws {Error} If a validation error occurs.
	  */
	async findOne(
		model: ModelDefined<ModelAttributes, ModelAttributes>,
		where: WhereOptions<ModelAttributes>,
		order?: Order,
		includeAttributes: string[] = [],
		excludeAttributes: string[] = [],
		transaction?: Transaction
	): Promise<Model<any, any> | null> {
		try {
			const data = await model.findOne({
				where: where,
				order,
				logging: false,
				attributes: { exclude: excludeAttributes, include: includeAttributes },
				transaction: transaction
			}).catch((err: string) => {
				throw err;
			});

			return data;
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				// Handle validation errors if needed
				throw new Error(`Validation error: ${error.message}`);
			} else {
				throw new Error(`Error finding record: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}


	/**
	  * Finds all records in the database using the specified Sequelize model and criteria.
	  *
	  * @async
	  * @param {ModelDefined<ModelAttributes, ModelAttributes>} model - The Sequelize model representing the database table.
	  * @param {WhereOptions<ModelAttributes>} where - The criteria to filter the records.
	  * @param {Order} order - The criteria to sort the records.
	  * @param {string[]} [excludeAttributes=[]] - An array of attributes to exclude from the result.
	  * @param {string[]} [includeAttributes=[]] - An array of attributes to include in the result.
	  * @param {Transaction} [transaction] - The optional Sequelize transaction for this find operation.
	  * @returns {Promise<Model[]>} A promise that resolves with an array of found records.
	  * @throws {Error} If there is an error during the find operation, an error with the corresponding error message is thrown.
	  */
	async findAllRecords(model: ModelDefined<ModelAttributes, ModelAttributes>, where: WhereOptions<ModelAttributes>, order?: Order, includeAttributes: string[] = [], excludeAttributes: string[] = [], transaction?: Transaction): Promise<Model[]> {
		try {
			const findOptions: FindOptions = {
				where,
				order,
				attributes: { exclude: excludeAttributes, include: includeAttributes },
				logging: true,
				raw: true,
				transaction, // Include the transaction in the find options
			};

			const data = await model.findAll(findOptions);

			return data;
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				// Handle validation errors if needed
				throw new Error(`Validation error: ${error.message}`);
			} else {
				throw new Error(`Error finding records: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}

	/**
	* Inserts a new record into the database using the specified Sequelize model and transaction (if provided).
	*
	* @param {ModelDefined<ModelAttributes, ModelAttributes>} model - The Sequelize model representing the database table.
	* @param {ModelAttributes} dataToInsert - The data to insert into the database.
	* @param {Transaction} [transaction] - The optional Sequelize transaction for this insertion operation.
	* @returns {Promise<Model<ModelAttributes>>} A promise that resolves with the newly inserted record.
	*/
	async insertRecord<T extends ModelAttributes>(model: ModelDefined<ModelAttributes, ModelAttributes>, dataToInsert: T, transaction?: Transaction): Promise<Model<ModelAttributes> | ExpressValidationError[]> {
		try {
			const data = await model.create(dataToInsert, { transaction });
			return data;
		} catch (error: any) {
			if (error instanceof ValidationError) {
				console.log(error.errors);
				const validationErrors = error.errors.map((error) => {
					return {
                        param: error.path, // Name of the field that caused the error
                        msg: error.message, // Validation error message
                    } as unknown as ExpressValidationError;
				});
				// You can choose how to handle or format the validationErrors array
				return validationErrors;
			} else {
				throw new Error(`Error inserting record: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}

	/**
	  * Inserts multiple records into the database using the specified Sequelize model and transaction (if provided).
	  *
	  * @param {ModelDefined<ModelAttributes, ModelAttributes>} model - The Sequelize model representing the database table.
	  * @param {ModelAttributes[]} dataToInsert - An array of data to insert into the database.
	  * @param {Transaction} [transaction] - The optional Sequelize transaction for this bulk insertion operation.
	  * @returns {Promise<Model<ModelAttributes>[]>} A promise that resolves with the newly inserted records as an array.
	*/
	async bulkInsertRecords<T extends ModelAttributes>(
		model: ModelDefined<ModelAttributes, ModelAttributes>,
		dataToInsert: T[],
		transaction?: Transaction
	): Promise<Model<ModelAttributes>[] | ExpressValidationError[]> {
		try {
			const data = await model.bulkCreate(dataToInsert, { transaction });
			return data;
		} catch (error: any) {
			if (error instanceof ValidationError) {
				// Handle validation errors if needed
				const validationErrors = error.errors.map((error) => {
					return {
                        param: error.path, // Name of the field that caused the error
                        msg: error.message, // Validation error message
                    } as unknown as ExpressValidationError;
				});
				return validationErrors;
			} else {
				throw new Error(`Error inserting records: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}


	/**
	* Updates records in the database using the specified Sequelize model and criteria within a transaction.
	*
	* @async
	* @param {ModelDefined<ModelAttributes, ModelAttributes>} model - The Sequelize model representing the database table.
	* @param {object} dataToUpdate - The data to update in the database.
	* @param {WhereOptions<ModelAttributes>} where - The criteria to determine which records to update.
	* @param {Transaction} [transaction] - The optional Sequelize transaction for this update operation.
	* @returns {Promise<number>} A promise that resolves with the number of updated rows.
	* @throws {Error} If there is an error during the update, an error with the corresponding error message is thrown.
	*/
	async updateRecords(model: ModelDefined<ModelAttributes, ModelAttributes>, dataToUpdate: object, where: WhereOptions<ModelAttributes>, transaction?: Transaction): Promise<number> {
		try {
			const [updatedRowCount] = await model.update(dataToUpdate, {
				where,
				transaction, // Include the transaction in the update options
			});

			return updatedRowCount;
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				// Handle validation errors if needed
				throw new Error(`Validation error: ${error.message}`);
			} else {
				throw new Error(`Error updating records: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}



	/**
	  * Deletes records from the database using the specified Sequelize model and criteria.
	  *
	  * @async
	  * @param {ModelDefined<ModelAttributes, ModelAttributes>} model - The Sequelize model representing the database table.
	  * @param {WhereOptions<ModelAttributes>} where - The criteria to determine which records to delete.
	  * @param {Transaction} [transaction] - The optional Sequelize transaction for this delete operation.
	  * @returns {Promise<{ 'row-deleted': number, 'success': boolean }>} A promise that resolves with an object containing the number of deleted rows and a success indicator.
	  * @throws {Error} If there is an error during the delete operation, an error with the corresponding error message is thrown.
	  */
	async deleteRecords(model: ModelDefined<ModelAttributes, ModelAttributes>, where: WhereOptions<ModelAttributes>, transaction?: Transaction): Promise<{ 'row-deleted': number, 'success': boolean }> {
		try {
			const deleteData = await model.destroy({
				where,
				transaction, // Include the transaction in the delete options
			});

			return { 'row-deleted': deleteData, 'success': true };
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				// Handle validation errors if needed
				throw new Error(`Validation error: ${error.message}`);
			} else {
				throw new Error(`Error deleting records: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}

	/**
	* Executes a custom SQL query.
	*
	* @async
	* @param {string} sqlQuery - The SQL query to execute.
	* @param {Transaction} [transaction] - The optional Sequelize transaction for this operation.
	* @param {Object} [queryOptions] - Additional query options, such as replacements and type.
	* @returns {Promise<any>} A promise that resolves with the query result.
	*/
	async executeCustomQuery(
		sqlQuery: string,
		queryOptions?: { replacements?: Record<string, any>, type?: QueryTypes },
		transaction?: Transaction,): Promise<any> {
		try {
			const { replacements, type } = queryOptions || {};
			const queryResult = await this.getAppObj().dBObject?.query(sqlQuery, {
				replacements,
				type,
				transaction
			});

			return queryResult;
		} catch (error: unknown) {
			if (error instanceof ValidationError) {
				// Handle validation errors if needed
				throw new Error(`Validation error: ${error.message}`);
			} else {
				throw new Error(`Error executing custom query: ${error instanceof Error ? error.message : 'Unknown error'}`);
			}
		}
	}


	/**
	 * Sends an SMS message via the Gupshup API to the specified phone number and handles any errors.
	 *
	 * @async
	 * @param {string} phone - The phone number to send the SMS to.
	 * @param {string} message - The text message to send.
	 * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the message was sent successfully.
	 */
	async sentMessage(phone: string, message: string): Promise<boolean | undefined> {
		try {
			const isSent = await this.sendSMS(phone, message);
			return isSent;
		} catch (error: unknown) {
			console.error(`Error sending OTP: ${error}`);
		}
	}

	/**
	  * Sends an SMS message via the Gupshup API to the specified phone number.
	  *
	  * @async
	  * @param {string} phone - The phone number to send the SMS to.
	  * @param {string} message - The text message to send.
	  * @returns {Promise<boolean>} A promise that resolves with a boolean indicating whether the message was sent successfully.
	  * @throws {Error} If there is an error while sending the SMS, an error with the corresponding error message is thrown.
	  */
	async sendSMS(phone: string, otp: string): Promise<any> {

		let message = `Your OTP for signing up with Aanchal is: ${otp}. Please enter this code to complete your registration. This code is valid for 5 minutes. Do not share it with anyone.`;
		try {
			const params = {
			  Message: message,        // The message you want to send
			  PhoneNumber: phone, // Phone number in E.164 format
			  MessageAttributes: {
				'AWS.SNS.SMS.SMSType': {
				  DataType: 'String',
				  StringValue: 'Transactional', // Can be 'Transactional' or 'Promotional'
				},
			  },
			};
		
			const command = new PublishCommand(params);
			const response = await this.getAppObj().awsSNSObj!.send(command);
			console.log('SMS sent successfully:', response);
		  } catch (error) {
			console.error('Error sending SMS:', error);
		  }
}

}

