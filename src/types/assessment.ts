export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type QuestionItem = {
  id: string
  section: string
  subItem: string
  question: string
}

export type AnswerMap = Record<string, SkillLevel>
