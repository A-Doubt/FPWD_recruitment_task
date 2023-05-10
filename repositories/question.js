const { readFile, writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    if (!fileContent) return null

    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    if (!fileContent) return null

    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)

    return question
  }

  const addQuestion = async question => {
    let fileContent = await readFile(fileName, { encoding: 'utf-8' })
    if (!fileContent) fileContent = JSON.stringify([])

    const questions = JSON.parse(fileContent)
    if (!questions.find(q => q.summary === question.summary)) {
      questions.push(question)
      await writeFile(fileName, JSON.stringify(questions))
      return question
    }

    return null
  }

  const getAnswers = async questionId => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    if (!fileContent) return null

    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)

    return question ? question.answers : null
  }

  const getAnswer = async (questionId, answerId) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    if (!fileContent) return null

    const questions = JSON.parse(fileContent)

    const question = questions.find(q => q.id === questionId)
    const answer = question.answers.find(a => a.id === answerId)

    return (question && answer) ? answer : null
  }

  const addAnswer = async (questionId, answer) => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    if (!fileContent) return null

    const questions = JSON.parse(fileContent)
    const question = questions.find(q => q.id === questionId)

    const existingAnswer = question.answers.find(a => a.summary === answer.summary)
    if (existingAnswer || !question) {
      return null
    }

    question.answers.push(answer)
    await writeFile(fileName, JSON.stringify(questions))

    return answer
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
