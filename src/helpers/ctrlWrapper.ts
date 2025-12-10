import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Type for async request handler functions
 */
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

/**
 * Wraps async controller functions to automatically catch errors
 * and pass them to the Express error handler middleware.
 *
 * This eliminates the need for try-catch blocks in every controller.
 *
 * @param ctrl - Async controller function to wrap
 * @returns Wrapped request handler that catches errors
 *
 * @example
 * // Without ctrlWrapper (manual try-catch)
 * const getUser = async (req, res, next) => {
 *   try {
 *     const user = await prisma.user.findUnique({ where: { id: req.params.id } });
 *     res.json(user);
 *   } catch (error) {
 *     next(error);
 *   }
 * };
 *
 * // With ctrlWrapper (automatic error handling)
 * const getUser = ctrlWrapper(async (req, res) => {
 *   const user = await prisma.user.findUnique({ where: { id: req.params.id } });
 *   res.json(user);
 * });
 */
const ctrlWrapper = (ctrl: AsyncRequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await ctrl(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default ctrlWrapper;
