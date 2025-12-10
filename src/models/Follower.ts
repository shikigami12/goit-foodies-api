import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './User';

interface FollowerAttributes {
    id: string;
    userId: string;
    followerId: string;
    createdAt?: Date;
}

interface FollowerCreationAttributes extends Optional<FollowerAttributes, 'id'> { }

class Follower extends Model<FollowerAttributes, FollowerCreationAttributes> implements FollowerAttributes {
    public id!: string;
    public userId!: string;
    public followerId!: string;
    public readonly createdAt!: Date;
}

Follower.init(
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
        followerId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'follower_id',
            references: { model: 'users', key: 'id' },
        },
    },
    {
        sequelize,
        tableName: 'followers',
        modelName: 'Follower',
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'follower_id'],
            },
        ],
    }
);

// Associations - Self-referencing
User.belongsToMany(User, { through: Follower, as: 'followers', foreignKey: 'userId', otherKey: 'followerId' });
User.belongsToMany(User, { through: Follower, as: 'following', foreignKey: 'followerId', otherKey: 'userId' });

export default Follower;
