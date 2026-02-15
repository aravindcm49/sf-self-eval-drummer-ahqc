export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type ExperienceRange = '0-3' | '3-6' | '6-9'

export type QuestionItem = {
  id: string
  section: string
  subSection: string
  question: string
}

export type AnswerMap = Record<string, SkillLevel>

export type ScoreExpectation = Record<ExperienceRange, number>

export type ScoreMatrixItem = {
  id: string
  section: string
  subSection: string
  expected: ScoreExpectation
}
