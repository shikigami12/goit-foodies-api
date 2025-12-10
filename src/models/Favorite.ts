import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './User';
import Recipe from './Recipe';

interface FavoriteAttributes {
    id: string;
    userId: string;
    recipeId: string;
    createdAt?: Date;
}

interface FavoriteCreationAttributes extends Optional<FavoriteAttributes, 'id'> { }

class Favorite extends Model<FavoriteAttributes, FavoriteCreationAttributes> implements FavoriteAttributes {
    public id!: string;
    public userId!: string;
    public recipeId!: string;
    public readonly createdAt!: Date;
}

Favorite.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: { model: 'users', key: 'id' },
        },
        recipeId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'recipe_id',
            references: { model: 'recipes', key: 'id' },
        },
    },
    {
        sequelize,
        tableName: 'favorites',
        modelName: 'Favorite',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'recipe_id'],
            },
        ],
    }
);

// Associations
User.belongsToMany(Recipe, { through: Favorite, as: 'favoriteRecipes', foreignKey: 'userId', otherKey: 'recipeId' });
Recipe.belongsToMany(User, { through: Favorite, as: 'favoritedBy', foreignKey: 'recipeId', otherKey: 'userId' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Recipe.hasMany(Favorite, { foreignKey: 'recipeId', as: 'favorites' });

export default Favorite;
