import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

interface CategoryAttributes {
    id: string;
    name: string;
    thumb: string | null;
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id' | 'thumb'> { }

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    public id!: string;
    public name!: string;
    public thumb!: string | null;
}

Category.init(
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
        thumb: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'categories',
        modelName: 'Category',
        timestamps: false,
    }
);

export default Category;
