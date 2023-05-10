const { writeFile, rm } = require('fs/promises')
const { faker } = require('@faker-js/faker')
const { makeQuestionRepository } = require('./question')

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo

  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))

    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return a question with the given id', async () => {
    const idToFetch = faker.datatype.uuid()
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: idToFetch,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const question = await questionRepo.getQuestionById(idToFetch)

    expect
    expect(question.id).toBe(idToFetch)
    expect(question).toStrictEqual(testQuestions.find(q => q.id === idToFetch))
  })

  test('should return undefined when a question is not found', async () => {
    const nonExistentId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]

    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const noQuestion = await questionRepo.getQuestionById(nonExistentId)
    expect(noQuestion).toBeUndefined()
  })

  test('should add a new question and return it', async () => {
    const testQuestion = {
      id: faker.datatype.uuid(),
      summary: 'How do you make the number one disappear?',
      author: 'Somebody',
      answers: [
        {
          id: faker.datatype.uuid(),
          author: 'Me',
          summary: 'Add a "G" and it\'s gone!'
        }
      ]
    }
    const returnedQuestion = await questionRepo.addQuestion(testQuestion)

    expect(returnedQuestion).toBeTruthy()
    expect(returnedQuestion).toStrictEqual(testQuestion)
  })

  test('should fail to add a new question with duplicate summary', async () => {
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const returnedQuestion = await questionRepo.addQuestion(testQuestions[0])

    expect(returnedQuestion).toBeFalsy()
    expect(returnedQuestion).toBeNull()
  })

  test('should fail to add a new question with malformed body', async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    const testQuestion = {
      hello: 'bob',
      notAnAnswer: 123
    }

    const returnedQuestion = await questionRepo.addQuestion(testQuestion)

    expect(await questionRepo.getQuestions()).toHaveLength(0)
    expect(returnedQuestion).toBeFalsy()
    expect(returnedQuestion).toBeNull()
  })

  test('should return answers by question id', async () => {
    const idToFetch = faker.datatype.uuid()
    const answers = [
      {
        id: faker.datatype.uuid(),
        author: 'Author1',
        summary: 'answer1'
      },
      {
        id: faker.datatype.uuid(),
        author: 'Author2',
        summary: 'answer2'
      }
    ]
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: idToFetch,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: answers
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const returnedAnswers = await questionRepo.getAnswers(idToFetch)

    expect(returnedAnswers).toHaveLength(2)
    expect(returnedAnswers).toStrictEqual(answers)
  })

  test('should return empty array if there are no answers', async () => {
    const idToFetch = faker.datatype.uuid()
    const answers = []
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: idToFetch,
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: answers
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const returnedAnswers = await questionRepo.getAnswers(idToFetch)
    expect(returnedAnswers).toHaveLength(0)
    expect(returnedAnswers).toStrictEqual([])
  })

  test('should return null as answers by non-existent question id', async () => {
    const nonExistentId = faker.datatype.uuid()
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const returnedAnswers = await questionRepo.getAnswers(nonExistentId)

    expect(returnedAnswers).toBeNull()
  })

  test('should add a new answer and return it', async () => {
    const answer = {
      id: faker.datatype.uuid(),
      author: 'Author1',
      summary: 'answer1'
    }
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const questionId = testQuestions[0].id
    const returnedAnswer = await questionRepo.addAnswer(questionId, answer)

    expect(returnedAnswer).toBeTruthy()
    expect(returnedAnswer).toMatchObject(answer)
    const answers = await questionRepo.getAnswers(questionId)
    console.log(answers)
    expect(answers).toHaveLength(1)
  })

  test('should fail to add an answer with duplicate summary', async () => {
    const answer = {
      id: faker.datatype.uuid(),
      author: 'Author1',
      summary: 'answer1'
    }
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: [answer]
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const questionId = testQuestions[0].id
    const returnedAnswer = await questionRepo.addAnswer(questionId, answer)

    expect(await questionRepo.getAnswers(questionId)).toHaveLength(1)
    expect(returnedAnswer).toBeNull()
  })

  test('should fail to add an answer with malformed body', async () => {
    const malformedAnswer = {
      hello: 'bob',
      notAnAnswer: 123
    }
    const testQuestions = [
      {
        id: faker.datatype.uuid(),
        summary: 'What is my name?',
        author: 'Jack London',
        answers: []
      },
      {
        id: faker.datatype.uuid(),
        summary: 'Who are you?',
        author: 'Tim Doods',
        answers: []
      }
    ]
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    const questionId = testQuestions[0].id
    const returnedAnswer = await questionRepo.addAnswer(questionId, malformedAnswer)

    expect(await questionRepo.getAnswers(questionId)).toHaveLength(0)
    expect(returnedAnswer).toBeNull()
  })
})
