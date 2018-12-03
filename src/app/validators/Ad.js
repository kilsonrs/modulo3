const Joi = require('joi') // Schema validator. Bate os objetos pra ver o que está faltando

module.exports = {
  body: {
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required()
  }
}
