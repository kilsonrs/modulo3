const Joi = require('joi') // Schema validator. Bate os objetos pra ver o que está faltando

module.exports = {
  body: {
    name: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(6)
  }
}
