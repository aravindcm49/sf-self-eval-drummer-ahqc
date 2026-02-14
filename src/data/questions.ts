import rawQuestions from './questions.json'
import type { QuestionItem } from '../types/assessment'

const isString = (value: unknown): value is string => typeof value === 'string'

const toQuestionItem = (value: unknown, index: number): QuestionItem => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`Invalid question at index ${index}: expected object`)
  }

  const candidate = value as Record<string, unknown>

  if (
    !isString(candidate.id) ||
    !isString(candidate.section) ||
    !isString(candidate.subItem) ||
    !isString(candidate.question)
  ) {
    throw new Error(`Invalid question at index ${index}: missing required string fields`)
  }

  return {
    id: candidate.id,
    section: candidate.section,
    subItem: candidate.subItem,
    question: candidate.question,
  }
}

const mappedQuestions = rawQuestions.map(toQuestionItem)
const uniqueIds = new Set(mappedQuestions.map((question) => question.id))

if (uniqueIds.size !== mappedQuestions.length) {
  throw new Error('Duplicate question ids found in src/data/questions.json')
}

export const QUESTIONS: QuestionItem[] = mappedQuestions
