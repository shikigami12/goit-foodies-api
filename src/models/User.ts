import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';

/**
 * User attributes interface
 */
interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    avatar: string | null;
    token: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * User creation attributes (id is optional for creation)
 */
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'avatar' | 'token'> { }

/**
 * User model
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         avatar:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public avatar!: string | null;
    public token!: string | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'User',
    }
);

export default User;
