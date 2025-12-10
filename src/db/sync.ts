import dotenv from 'dotenv';
import sequelize from './sequelize';

// Import all models to register them
import '../models';

dotenv.config();

/**
 * Database sync script
 * Run with: npm run db:sync
 */
async function syncDatabase(): Promise<void> {
    try {
        console.log('🔄 Syncing database...');

        // Use alter: true in development to update schema without losing data
        // Use force: true only if you want to recreate all tables (destructive!)
        await sequelize.sync({ alter: true });

        console.log('✅ Database synced successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database sync failed:', error);
        process.exit(1);
    }
}

syncDatabase();
