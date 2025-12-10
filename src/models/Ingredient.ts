import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

interface IngredientAttributes {
    id: string;
    name: string;
    description: string | null;
    img: string | null;
}

interface IngredientCreationAttributes extends Optional<IngredientAttributes, 'id' | 'description' | 'img'> { }

class Ingredient extends Model<IngredientAttributes, IngredientCreationAttributes> implements IngredientAttributes {
    public id!: string;
    public name!: string;
    public description!: string | null;
    public img!: string | null;
}

Ingredient.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        img: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'ingredients',
        modelName: 'Ingredient',
        timestamps: false,
    }
);

export default Ingredient;
