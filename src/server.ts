import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import app from './app';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function main(): Promise<void> {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 API available at http://localhost:${PORT}/api`);
            console.log(`❤️  Health check at http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

main();

// Export prisma for use in other modules
export { prisma };
