const Joi = require('joi') // Schema validator. Bate os objetos pra ver o que está faltando

module.exports = {
  body: {
    ad: Joi.string().required(),
    content: Joi.string().required()
  }
}
