import rawScoreMatrix from './score-matrix.json'
import type {
  ExperienceRange,
  ScoreExpectation,
  ScoreMatrixItem,
} from '../types/assessment'

const RANGE_KEYS: ExperienceRange[] = ['0-3', '3-6', '6-9']

const isString = (value: unknown): value is string => typeof value === 'string'
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const toExpectation = (value: unknown, index: number): ScoreExpectation => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`Invalid matrix item at index ${index}: expected object for expected values`)
  }

  const candidate = value as Record<string, unknown>
  const mapped = {} as ScoreExpectation

  for (const rangeKey of RANGE_KEYS) {
    if (!isNumber(candidate[rangeKey])) {
      throw new Error(
        `Invalid matrix item at index ${index}: missing numeric expected value for "${rangeKey}"`,
      )
    }

    mapped[rangeKey] = candidate[rangeKey]
  }

  return mapped
}

const toScoreMatrixItem = (value: unknown, index: number): ScoreMatrixItem => {
  if (typeof value !== 'object' || value === null) {
    throw new Error(`Invalid matrix item at index ${index}: expected object`)
  }

  const candidate = value as Record<string, unknown>

  if (!isString(candidate.id) || !isString(candidate.section) || !isString(candidate.subSection)) {
    throw new Error(
      `Invalid matrix item at index ${index}: missing required id, section, or subSection`,
    )
  }

  return {
    id: candidate.id,
    section: candidate.section,
    subSection: candidate.subSection,
    expected: toExpectation(candidate.expected, index),
  }
}

const mappedMatrix = rawScoreMatrix.map(toScoreMatrixItem)
const uniqueIds = new Set(mappedMatrix.map((item) => item.id))

if (uniqueIds.size !== mappedMatrix.length) {
  throw new Error('Duplicate matrix ids found in src/data/score-matrix.json')
}

export const SCORE_MATRIX: ScoreMatrixItem[] = mappedMatrix
