import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = process.cwd()
const QUESTIONS_PATH = resolve(ROOT, 'src/data/questions.json')
const MATRIX_PATH = resolve(ROOT, 'src/data/score-matrix.json')

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

const questions = readJson(QUESTIONS_PATH)
const matrix = readJson(MATRIX_PATH)

const keyFor = (item) => `${item.section}::${item.subSection}`

const uniqueQuestionKeys = new Set(questions.map(keyFor))
const uniqueMatrixKeys = new Set(matrix.map(keyFor))

const missingMatrixKeys = [...uniqueQuestionKeys].filter((key) => !uniqueMatrixKeys.has(key))
const unusedMatrixKeys = [...uniqueMatrixKeys].filter((key) => !uniqueQuestionKeys.has(key))

if (missingMatrixKeys.length > 0 || unusedMatrixKeys.length > 0) {
  if (missingMatrixKeys.length > 0) {
    console.error('Missing score-matrix entries for question groups:')
    for (const key of missingMatrixKeys) {
      console.error(`- ${key}`)
    }
  }

  if (unusedMatrixKeys.length > 0) {
    console.error('Score-matrix entries without matching questions:')
    for (const key of unusedMatrixKeys) {
      console.error(`- ${key}`)
    }
  }

  process.exit(1)
}

console.log('Assessment data check passed: questions and score matrix are aligned.')
