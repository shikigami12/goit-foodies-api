import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
import Recipe from './Recipe';
import Ingredient from './Ingredient';

interface RecipeIngredientAttributes {
    id: string;
    recipeId: string;
    ingredientId: string;
    measure: string;
}

interface RecipeIngredientCreationAttributes extends Optional<RecipeIngredientAttributes, 'id'> { }

class RecipeIngredient extends Model<RecipeIngredientAttributes, RecipeIngredientCreationAttributes> implements RecipeIngredientAttributes {
    public id!: string;
    public recipeId!: string;
    public ingredientId!: string;
    public measure!: string;
}

RecipeIngredient.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        recipeId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'recipe_id',
            references: { model: 'recipes', key: 'id' },
        },
        ingredientId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'ingredient_id',
            references: { model: 'ingredients', key: 'id' },
        },
        measure: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'recipe_ingredients',
        modelName: 'RecipeIngredient',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['recipe_id', 'ingredient_id'],
            },
        ],
    }
);

// Associations
Recipe.hasMany(RecipeIngredient, { foreignKey: 'recipeId', as: 'ingredients' });
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipeId' });
RecipeIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId', as: 'ingredient' });
Ingredient.hasMany(RecipeIngredient, { foreignKey: 'ingredientId' });

export default RecipeIngredient;
