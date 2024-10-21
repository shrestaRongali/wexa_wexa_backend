import { Model, Sequelize, BuildOptions, DataTypes } from 'sequelize';

/**
 * Interface representing the attributes of the User model.
 */
export interface UserAttributes {
	id: number;
	name: string;
	email: string;
	phone: string;
    password: string | null;
	created_at: string;
	updated_at: string;
	last_log_in: string;
}

/**
 * Represents an instance of the User model.
 */
export interface UserInstance extends Model<UserAttributes>, UserAttributes { }

/**
 * Represents the User model with associated static methods.
 */
export type UserModel = typeof Model & {
	new(values?: object, options?: BuildOptions): UserInstance;
};

/**
 * Initialize and define the User model using Sequelize.
 * @param sequelize - The Sequelize instance to associate with the model.
 * @returns The initialized UserModel.
 */
export function initUserModel(sequelize: Sequelize): UserModel {
	return <UserModel>sequelize.define<UserInstance>('users', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		last_log_in: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	});
}
