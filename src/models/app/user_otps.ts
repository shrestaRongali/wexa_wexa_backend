import { Model, Sequelize, BuildOptions, DataTypes } from 'sequelize';

/**
 * Interface representing the attributes of the UserOtp model.
 */
export interface UserOtpAttributes {
    id?: number;
	user_id: number;
	phone: string;
	otp: number;
	created_at: string;
	updated_at: string;
}

/**
 * Represents an instance of the UserOtp model.
 */
export interface UserOtpInstance extends Model<UserOtpAttributes>, UserOtpAttributes { }

/**
 * Represents the UserOtp model with associated static methods.
 */
export type UserOtpModel = typeof Model & {
	new(values?: object, options?: BuildOptions): UserOtpInstance;
};

/**
 * Initialize and define the UserOtp model using Sequelize.
 * @param sequelize - The Sequelize instance to associate with the model.
 * @returns The initialized UserOtpModel.
 */
export function initUserOtpModel(sequelize: Sequelize): UserOtpModel {
	return <UserOtpModel>sequelize.define<UserOtpInstance>('user_otps', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
		phone: {
			type: DataTypes.STRING,
			allowNull: true,
		},
        otp: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
	},
	{
        timestamps: false,
        // paranoid: true,
		// createdAt: 'created_at', 
        // updatedAt: 'updated_at',
        tableName: 'user_otps',
        schema: 'public', // Specify your schema here (e.g., 'public')
	}
);
}
