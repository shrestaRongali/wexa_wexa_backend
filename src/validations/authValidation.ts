import Joi from 'joi';

export const signup = {
  body: Joi.object({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    phone: Joi.string().required(),
    otp: Joi.string().required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().required(),
  }).required(),
};

export const sendSignupOtp = {
  body: Joi.object({
    email: Joi.string().required().email(),
    phone: Joi.string().required(),
  }).required(),
};

export const login = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }).required(),
};
