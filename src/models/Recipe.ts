import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './User';
import Category from './Category';
import Area from './Area';

interface RecipeAttributes {
    id: string;
    title: string;
    instructions: string;
    thumb: string | null;
    time: string | null;
    ownerId: string;
    categoryId: string;
    areaId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface RecipeCreationAttributes extends Optional<RecipeAttributes, 'id' | 'thumb' | 'time'> { }

class Recipe extends Model<RecipeAttributes, RecipeCreationAttributes> implements RecipeAttributes {
    public id!: string;
    public title!: string;
    public instructions!: string;
    public thumb!: string | null;
    public time!: string | null;
    public ownerId!: string;
    public categoryId!: string;
    public areaId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Recipe.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        thumb: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        time: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'owner_id',
            references: { model: 'users', key: 'id' },
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'category_id',
            references: { model: 'categories', key: 'id' },
        },
        areaId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'area_id',
            references: { model: 'areas', key: 'id' },
        },
    },
    {
        sequelize,
        tableName: 'recipes',
        modelName: 'Recipe',
    }
);

// Associations
Recipe.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
Recipe.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Recipe.belongsTo(Area, { foreignKey: 'areaId', as: 'area' });
User.hasMany(Recipe, { foreignKey: 'ownerId', as: 'recipes' });
Category.hasMany(Recipe, { foreignKey: 'categoryId', as: 'recipes' });
Area.hasMany(Recipe, { foreignKey: 'areaId', as: 'recipes' });

export default Recipe;
