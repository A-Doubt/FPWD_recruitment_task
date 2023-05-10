const Joi = require('joi')
const answerSchema = require('./answerSchema')

const questionSchema = Joi.object({
  id: Joi.string().uuid().required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  answers: Joi.array().items(answerSchema)
})

module.exports = questionSchema
