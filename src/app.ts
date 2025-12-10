import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middlewares';

const app: Application = express();

// CORS configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    })
);

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (will be added later)
// app.use('/api/auth', authRouter);
// app.use('/api/users', usersRouter);
// app.use('/api/categories', categoriesRouter);
// app.use('/api/areas', areasRouter);
// app.use('/api/ingredients', ingredientsRouter);
// app.use('/api/testimonials', testimonialsRouter);
// app.use('/api/recipes', recipesRouter);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use(errorHandler);

export default app;
