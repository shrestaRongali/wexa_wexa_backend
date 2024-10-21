import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { BadRequestError } from '@AppErrors/bad-request-error';

const pick = (object: Record<string, any>, keys: string[]) =>
  keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      return { ...obj, [key]: object[key] };
    }
    return obj;
  }, {});

const validate =
  (schema: Record<string, any>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({ errors: { label: 'key' } })
      .validate(object);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new BadRequestError(errorMessage));
    }
    Object.assign(req, value);
    return next();
  };

export default validate;
