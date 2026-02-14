import { useMemo, useState } from 'react'
import './App.css'
import { QUESTIONS } from './data/questions'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import type { AnswerMap, SkillLevel } from './types/assessment'

const LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced']

const SCORE_BY_LEVEL: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

type SectionTotal = {
  section: string
  total: number
  max: number
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})

  const isComplete = currentIndex >= QUESTIONS.length
  const currentQuestion = QUESTIONS[currentIndex]

  const selectedLevel = currentQuestion ? answers[currentQuestion.id] : undefined

  const maxScore = QUESTIONS.length * 3

  const totalScore = useMemo(
    () =>
      Object.values(answers).reduce((sum, level) => sum + SCORE_BY_LEVEL[level], 0),
    [answers],
  )

  const sectionTotals = useMemo<SectionTotal[]>(() => {
    const grouped = new Map<string, Omit<SectionTotal, 'section'>>()

    for (const question of QUESTIONS) {
      const existing = grouped.get(question.section) ?? { total: 0, max: 0 }
      existing.max += 3

      const level = answers[question.id]
      if (level) {
        existing.total += SCORE_BY_LEVEL[level]
      }

      grouped.set(question.section, existing)
    }

    return Array.from(grouped.entries()).map(([section, values]) => ({
      section,
      ...values,
    }))
  }, [answers])

  const handleSelect = (level: SkillLevel) => {
    if (!currentQuestion) {
      return
    }

    const { id } = currentQuestion

    setAnswers((previous) => ({
      ...previous,
      [id]: level,
    }))

    setCurrentIndex((previousIndex) => {
      if (QUESTIONS[previousIndex]?.id !== id) {
        return previousIndex
      }

      return Math.min(previousIndex + 1, QUESTIONS.length)
    })
  }

  const handleBack = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0))
  }

  const handleRestart = () => {
    setAnswers({})
    setCurrentIndex(0)
  }

  if (isComplete) {
    return (
      <div className="app-shell">
        <header className="top-navbar" aria-label="Application header">
          Salesforce Skill Self Evaluation
        </header>

        <Card className="eval-card eval-card--results">
          <header className="results-header">
            <h1>Evaluation Complete</h1>
            <p className="results-subtitle">Final Score Summary</p>
          </header>

          <section className="results-total">
            <p className="results-total__label">Overall Total</p>
            <p className="results-total__score">
              {totalScore} <span>/ {maxScore}</span>
            </p>
          </section>

          <section className="results-section-list">
            {sectionTotals.map(({ section, total, max }) => (
              <article key={section} className="section-total-card">
                <p className="section-total-card__name">{section}</p>
                <p className="section-total-card__score">
                  {total} <span>/ {max}</span>
                </p>
              </article>
            ))}
          </section>

          <div className="results-actions">
            <Button
              type="button"
              variant="default"
              className="nav-button nav-button--primary"
              onClick={handleRestart}
            >
              Restart
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="top-navbar" aria-label="Application header">
        Salesforce Skill Self Evaluation
      </header>

      <Card className="eval-card">
        <header className="question-header">
          <div className="question-header__topic">
            <p className="question-header__section">{currentQuestion.section}</p>
            <p className="question-header__divider">|</p>
            <p className="question-header__subitem">{currentQuestion.subItem}</p>
          </div>
          <p className="question-header__progress">
            Question {currentIndex + 1} / {QUESTIONS.length}
          </p>
        </header>

        <section key={currentQuestion.id} className="question-stage">
          <p className="question-stage__prompt">
            {currentIndex + 1}. {currentQuestion.question}
          </p>
        </section>

        <section className="choice-grid" aria-label="Choose current skill level">
          {LEVELS.map((level) => {
            const isActive = selectedLevel === level

            return (
              <Button
                key={level}
                type="button"
                variant="outline"
                size="lg"
                className={`choice-button ${isActive ? 'choice-button--active' : ''}`}
                onClick={() => handleSelect(level)}
              >
                {level}
              </Button>
            )
          })}
        </section>

        <footer className="action-row">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="nav-button"
            onClick={handleBack}
            disabled={currentIndex === 0}
          >
            Back
          </Button>
          <p className="auto-advance-note">Selecting a level auto-advances.</p>
        </footer>
      </Card>
    </div>
  )
}

export default App
