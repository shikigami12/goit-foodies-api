import dotenv from 'dotenv';
import { sequelize } from './db';
import app from './app';

// Import all models to register them
import './models';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

/**
 * Initialize database and start server
 */
async function main(): Promise<void> {
    try {
        // Sync database (creates tables if they don't exist)
        console.log('🔄 Syncing database...');
        await sequelize.sync({ alter: true });
        console.log('✅ Database synced');

        // Test connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 API: http://localhost:${PORT}/api`);
            console.log(`📖 Docs: http://localhost:${PORT}/api-docs`);
            console.log(`❤️  Health: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await sequelize.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await sequelize.close();
    process.exit(0);
});

main();
