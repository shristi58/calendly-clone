import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema, property: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req[property]);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues.map(i => i.message).join(', ');
        res.status(400).json({
          status: 'fail',
          message,
          errors: error.issues
        });
        return;
      }
      next(error);
    }
  };
};
