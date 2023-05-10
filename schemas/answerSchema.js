const Joi = require('joi')

const answerSchema = Joi.object({
  id: Joi.string().uuid().required(),
  author: Joi.string().required(),
  summary: Joi.string().required()
})

module.exports = answerSchema
