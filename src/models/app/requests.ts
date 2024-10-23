import { Model, Sequelize, BuildOptions, DataTypes } from 'sequelize';

/**
 * Interface representing the attributes of the Requests model.
 */
export interface RequestsAttributes {
    id: number;
    from_user_id: number;
    to_user_id: number;
    status: number;
	created_at: string;
	updated_at: string;
}

/**
 * Represents an instance of the Requests model.
 */
export interface RequestsInstance extends Model<RequestsAttributes>, RequestsAttributes { }

/**
 * Represents the Requests model with associated static methods.
 */
export type RequestsModel = typeof Model & {
	new(values?: object, options?: BuildOptions): RequestsInstance;
};

/**
 * Initialize and define the Requests model using Sequelize.
 * @param sequelize - The Sequelize instance to associate with the model.
 * @returns The initialized RequestsModel.
 */
export function initRequestsModel(sequelize: Sequelize): RequestsModel {
	return <RequestsModel>sequelize.define<RequestsInstance>('requests', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
        from_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
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
        tableName: 'requests',
        schema: 'public', // Specify your schema here (e.g., 'public')
	});
}
