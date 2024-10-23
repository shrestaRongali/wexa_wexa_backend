import { Model, Sequelize, BuildOptions, DataTypes } from 'sequelize';

/**
 * Interface representing the attributes of the Chats model.
 */
export interface ChatsAttributes {
    id?: number;
    from_user: number;
    to_user: number;
	created_at: string;
	message: string;
}

/**
 * Represents an instance of the Chats model.
 */
export interface ChatsInstance extends Model<ChatsAttributes>, ChatsAttributes { }

/**
 * Represents the Chats model with associated static methods.
 */
export type ChatsModel = typeof Model & {
	new(values?: object, options?: BuildOptions): ChatsInstance;
};

/**
 * Initialize and define the Chats model using Sequelize.
 * @param sequelize - The Sequelize instance to associate with the model.
 * @returns The initialized ChatsModel.
 */
export function initChatsModel(sequelize: Sequelize): ChatsModel {
	return <ChatsModel>sequelize.define<ChatsInstance>('chats', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
        from_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        to_user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
		created_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		message: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
        timestamps: false,
        // paranoid: true,
		// createdAt: 'created_at', 
        // updatedAt: 'updated_at',
        tableName: 'chats',
        schema: 'public', // Specify your schema here (e.g., 'public')
	});
}
