import { Model, Sequelize, BuildOptions, DataTypes } from 'sequelize';

/**
 * Interface representing the attributes of the CTImages model.
 */
export interface CTImagesAttributes {
    id?: number;
    user_id: number;
	image_url: string;
	created_at: string;
}

/**
 * Represents an instance of the CTImages model.
 */
export interface CTImagesInstance extends Model<CTImagesAttributes>, CTImagesAttributes { }

/**
 * Represents the CTImages model with associated static methods.
 */
export type CTImagesModel = typeof Model & {
	new(values?: object, options?: BuildOptions): CTImagesInstance;
};

/**
 * Initialize and define the CTImages model using Sequelize.
 * @param sequelize - The Sequelize instance to associate with the model.
 * @returns The initialized CTImagesModel.
 */
export function initCTImagesModel(sequelize: Sequelize): CTImagesModel {
	return <CTImagesModel>sequelize.define<CTImagesInstance>('ct_images', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
		},
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
		image_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		created_at: {
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
        tableName: 'ct_images',
        schema: 'public', // Specify your schema here (e.g., 'public')
	});
}
