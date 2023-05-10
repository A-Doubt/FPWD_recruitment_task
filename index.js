const express = require('express')
const { urlencoded, json } = require('body-parser')
const makeRepositories = require('./middleware/repositories')
const { faker } = require('@faker-js/faker')
const questionSchema = require('./schemas/questionSchema')
const answerSchema = require('./schemas/answerSchema')

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(makeRepositories(STORAGE_FILE_PATH))

app.get('/', welcome)
app.get('/questions', getQuestions)
app.get('/questions/:questionId', getQuestionById)
app.post('/questions', addQuestion)
app.get('/questions/:questionId/answers', getAnswersByQuestionId)
app.get('/questions/:questionId/answers/:answerId', getAnswerByAnswerId)
app.post('/questions/:questionId/answers', addAnswer)

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})

function welcome(_, res) {
  return res.status(200).json({ message: 'Welcome to responder!' })
}

async function getQuestions(req, res) {
  const questions = await req.repositories.questionRepo.getQuestions()
  return questions ? res.status(200).json(questions) : res.status(404).json('No data found.')
}

async function getQuestionById(req, res) {
  const question = await req.repositories.questionRepo.getQuestionById(req.params.questionId)
  return question ? res.status(200).json(question) : res.status(404).json('No data found.')
}

async function addQuestion(req, res) {
  const question = {
    id: faker.datatype.uuid(),
    author: req.body.author,
    summary: req.body.summary,
    answers: req.body.answers
  }

  const { error } = questionSchema.validate(question)
  if (error) return res.status(400).json('The provided question is invalid.')

  const q = await req.repositories.questionRepo.addQuestion(question)
  return res.status(201).json(q)
}

async function getAnswersByQuestionId(req, res) {
  const answers = await req.repositories.questionRepo.getAnswers(req.params.questionId)
  return answers ? res.status(200).json(answers) : res.status(404).json('No data found.')
}

async function getAnswerByAnswerId(req, res) {
  const questionId = req.params.questionId
  const answerId = req.params.answerId

  const answer = await req.repositories.questionRepo.getAnswer(questionId, answerId)
  return answer ? res.status(200).json(answer) : res.status(404).json('No data found.')
}

async function addAnswer(req, res) {
  const questionId = req.params.questionId
  const answer = {
    id: faker.datatype.uuid(),
    author: req.body.author,
    summary: req.body.summary
  }

  const { error } = answerSchema.validate(answer)
  if (error) return res.status(400).json('The provided answer is invalid')

  const a = await req.repositories.questionRepo.addAnswer(questionId, answer)
  return a ? res.status(201).json(a) : res.status(400).json()
}
