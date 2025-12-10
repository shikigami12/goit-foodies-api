// Re-export all middlewares from a single entry point (barrel file)
export { default as errorHandler } from './errorHandler';
export { default as validateBody } from './validateBody';
export { default as upload } from './upload';
export { default as auth } from './auth';
