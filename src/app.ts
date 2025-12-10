import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares';
import {
    authRouter,
    usersRouter,
    categoriesRouter,
    areasRouter,
    ingredientsRouter,
    testimonialsRouter,
    recipesRouter,
} from './routes';
import { swaggerSpec } from './swagger';

const app: Application = express();

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN;
const allowedOrigins = corsOrigin ? corsOrigin.split(',').map(o => o.trim()) : ['*'];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (Swagger, Postman, curl, etc.)
            if (!origin) {
                return callback(null, true);
            }
            // Allow all origins if '*' is in the list
            if (allowedOrigins.includes('*')) {
                return callback(null, true);
            }
            // Check if origin is in allowed list
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Foodies API Documentation',
}));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/areas', areasRouter);
app.use('/api/ingredients', ingredientsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/recipes', recipesRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
