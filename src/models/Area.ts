import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

interface AreaAttributes {
    id: string;
    name: string;
}

interface AreaCreationAttributes extends Optional<AreaAttributes, 'id'> { }

class Area extends Model<AreaAttributes, AreaCreationAttributes> implements AreaAttributes {
    public id!: string;
    public name!: string;
}

Area.init(
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
    },
    {
        sequelize,
        tableName: 'areas',
        modelName: 'Area',
        timestamps: false,
    }
);

export default Area;
