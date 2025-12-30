import { Request, Response, NextFunction } from 'express';

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Run the function, if it fails, pass error to Global Error Handler
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};