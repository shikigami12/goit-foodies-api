import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/sequelize';
import User from './User';

interface TestimonialAttributes {
    id: string;
    testimonial: string;
    userId: string;
    createdAt?: Date;
}

interface TestimonialCreationAttributes extends Optional<TestimonialAttributes, 'id'> { }

class Testimonial extends Model<TestimonialAttributes, TestimonialCreationAttributes> implements TestimonialAttributes {
    public id!: string;
    public testimonial!: string;
    public userId!: string;
    public readonly createdAt!: Date;
}

Testimonial.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        testimonial: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        tableName: 'testimonials',
        modelName: 'Testimonial',
        updatedAt: false,
    }
);

// Association
Testimonial.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Testimonial, { foreignKey: 'userId', as: 'testimonials' });

export default Testimonial;
