import Joi from 'joi';

export const updateProfile = {
    body: Joi.object({
      email: Joi.string().required().email(),
      phone: Joi.string().required(),
      name: Joi.string().required()
    }).required(),
  };

export const sendRequest = {
    query: Joi.object({
      id: Joi.number().required()
    }).required(),
  };

export const acceptRequest = {
    body: Joi.object({
      from_user_id: Joi.number().required(),
      accept: Joi.boolean().required()
    }).required(),
  };

export const sendChat = {
    body: Joi.object({
        to_user: Joi.number().required(),
        message: Joi.string().required()
      }).required(),
}

export const getChat = {
    query: Joi.object({
        id: Joi.number().required(),
      }).required(),
}