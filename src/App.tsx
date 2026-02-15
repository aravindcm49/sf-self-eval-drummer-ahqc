import { useMemo, useState, type ChangeEvent } from 'react'
import { Moon, Sun } from 'lucide-react'
import './App.css'
import { QUESTIONS } from './data/questions'
import { SCORE_MATRIX } from './data/scoreMatrix'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import type { AnswerMap, ExperienceRange, SkillLevel } from './types/assessment'

const LEVELS: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced']

const SCORE_BY_LEVEL: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
}

const EXPERIENCE_LEVEL_OPTIONS: Array<{ value: ExperienceRange; label: string }> = [
  { value: '0-3', label: '0-3 Years' },
  { value: '3-6', label: '3-6 Years' },
  { value: '6-9', label: '6-9 Years' },
]

const COACHING_PROMPTS = {
  foundational: [
    'Rebuild understanding from first principles',
    'Focus on core concepts before expanding scope',
    'Strengthen baseline knowledge in this area',
    'Revisit fundamentals with guided practice',
    'Stabilize core patterns and workflows',
    'Close essential knowledge gaps here',
    'Develop consistent execution at the basics level',
  ],

  refinement: [
    'Increase coverage depth here',
    'Refine this with deeper iteration',
    'Add another layer of analysis',
    'Drill further into edge cases',
    'Strengthen architectural thinking in this area',
    'Validate assumptions more rigorously',
    'Tighten implementation quality here',
    'Expand testing and scenario coverage',
  ],

  mastery: [
    'Polish for production level robustness',
    'Optimize for clarity and maintainability',
    'Elevate this toward expert level execution',
    'Strengthen strategic decision making here',
    'Stress test for extreme edge conditions',
    'Improve performance and scalability considerations',
    'Mentor level: explain and defend design choices clearly',
  ],
} as const

const ON_TRACK_PROMPTS = [
  'You are progressing as expected at this stage',
  'Right on track, continue building consistency',
  'Solid progress, keep reinforcing your approach',
  'Meeting expectations, focus on steady growth',
  'Maintain this trajectory and keep iterating',
  'Strong foundation in place, continue expanding',
  'Progressing well, avoid unnecessary overcorrection',
  'Keep compounding this level of effort',
  'Continue practicing with the same level of rigor',
  'You are aligned with the expected growth curve',
]

type FeedbackCategory = 'foundational' | 'refinement' | 'mastery' | 'on_track'
type BelowTargetCategory = Exclude<FeedbackCategory, 'on_track'>

type SectionTotal = {
  id: string
  section: string
  subSection: string
  total: number
  max: number
  comparisonState: 'on_track' | 'below'
  feedbackMessage: string
  feedbackCategory: FeedbackCategory
}

const toSectionKey = (section: string, subSection: string) => `${section}::${subSection}`

const hashSeed = (seed: string) => {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  return hash
}

const getSeededPrompt = (prompts: readonly string[], seed: string) => {
  const hash = hashSeed(seed)
  return prompts[hash % prompts.length]
}

const getBelowTargetCategory = (ratio: number): BelowTargetCategory => {
  if (ratio < 0.6) {
    return 'foundational'
  }

  if (ratio < 0.85) {
    return 'refinement'
  }

  return 'mastery'
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [experienceLevel, setExperienceLevel] = useState<ExperienceRange>('0-3')
  const [resultsSessionSeed, setResultsSessionSeed] = useState(() => Date.now())
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const isComplete = currentIndex >= QUESTIONS.length
  const currentQuestion = QUESTIONS[currentIndex]

  const selectedLevel = currentQuestion ? answers[currentQuestion.id] : undefined

  const maxScore = QUESTIONS.length * 3

  const totalScore = useMemo(
    () =>
      Object.values(answers).reduce((sum, level) => sum + SCORE_BY_LEVEL[level], 0),
    [answers],
  )

  const sectionTotals = useMemo(() => {
    const grouped = new Map<string, { total: number; max: number }>()

    for (const question of QUESTIONS) {
      const key = toSectionKey(question.section, question.subSection)
      const existing = grouped.get(key) ?? { total: 0, max: 0 }
      existing.max += 3

      const level = answers[question.id]
      if (level) {
        existing.total += SCORE_BY_LEVEL[level]
      }

      grouped.set(key, existing)
    }

    return grouped
  }, [answers])

  const breakdownCards = useMemo<SectionTotal[]>(
    () =>
      SCORE_MATRIX.map((matrixEntry) => {
        const key = toSectionKey(matrixEntry.section, matrixEntry.subSection)
        const score = sectionTotals.get(key) ?? { total: 0, max: matrixEntry.expected['6-9'] }
        const targetScore = matrixEntry.expected[experienceLevel]

        const isOnTrack = score.total >= targetScore
        const comparisonState: SectionTotal['comparisonState'] = isOnTrack
          ? 'on_track'
          : 'below'

        const ratio = targetScore === 0 ? 1 : score.total / targetScore
        let feedbackCategory: FeedbackCategory
        let feedbackMessage: string

        if (isOnTrack) {
          feedbackCategory = 'on_track'
          feedbackMessage = getSeededPrompt(
            ON_TRACK_PROMPTS,
            `${resultsSessionSeed}:${matrixEntry.id}:on_track`,
          )
        } else {
          const belowCategory = getBelowTargetCategory(ratio)
          feedbackCategory = belowCategory
          feedbackMessage = getSeededPrompt(
            COACHING_PROMPTS[belowCategory],
            `${resultsSessionSeed}:${matrixEntry.id}:${belowCategory}`,
          )
        }

        return {
          id: matrixEntry.id,
          section: matrixEntry.section,
          subSection: matrixEntry.subSection,
          total: score.total,
          max: score.max,
          comparisonState,
          feedbackMessage,
          feedbackCategory,
        }
      }),
    [experienceLevel, resultsSessionSeed, sectionTotals],
  )

  const handleSelect = (questionId: string, questionIndex: number, level: SkillLevel) => {
    if (!QUESTIONS[questionIndex]) {
      return
    }

    const isLastQuestion = questionIndex === QUESTIONS.length - 1

    if (isLastQuestion) {
      setResultsSessionSeed((previousSeed) => previousSeed + 1)
    }

    setAnswers((previous) => ({
      ...previous,
      [questionId]: level,
    }))

    setCurrentIndex(Math.min(questionIndex + 1, QUESTIONS.length))
  }

  const handleBack = () => {
    setCurrentIndex((previousIndex) => Math.max(previousIndex - 1, 0))
  }

  const handleRestart = () => {
    setAnswers({})
    setExperienceLevel('0-3')
    setResultsSessionSeed((previousSeed) => previousSeed + 1)
    setCurrentIndex(0)
  }

  const handleExperienceLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ExperienceRange
    setExperienceLevel(value)
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  const isLightTheme = theme === 'light'
  const shellClassName = `app-shell ${isLightTheme ? 'app-shell--light' : ''}`
  const themeToggleLabel = isLightTheme ? 'Switch to dark mode' : 'Switch to light mode'

  const topNavbar = (
    <header className="top-navbar" aria-label="Application header">
      <span className="top-navbar__title">Salesforce Skill Self Evaluation</span>
      <button
        type="button"
        className={`theme-toggle ${isLightTheme ? 'theme-toggle--light' : ''}`}
        onClick={toggleTheme}
        aria-pressed={isLightTheme}
        aria-label={themeToggleLabel}
        title={themeToggleLabel}
      >
        <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={12} aria-hidden="true" />
        <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={12} aria-hidden="true" />
        <span className="theme-toggle__thumb" aria-hidden="true" />
      </button>
    </header>
  )

  if (isComplete) {
    return (
      <div className={shellClassName}>
        {topNavbar}

        <div className="assessment-layout assessment-layout--results">
          <Card className="assessment-card assessment-card--results">
            <main className="assessment-main assessment-main--results">
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

              <section className="results-range-picker" aria-label="Experience level selector">
                <label className="results-range-picker__label" htmlFor="experience-level">
                  Choose experience level
                </label>
                <div className="results-range-picker__control">
                  <select
                    id="experience-level"
                    className="results-range-picker__select"
                    value={experienceLevel}
                    onChange={handleExperienceLevelChange}
                  >
                    {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <section className="results-breakdown" aria-label="Section score breakdown">
                <h2 className="results-breakdown__title">Section &amp; Sub-section Breakup</h2>
                <div className="results-breakdown__grid">
                  {breakdownCards.map(
                    ({
                      id,
                      section,
                      subSection,
                      total,
                      max,
                      comparisonState,
                      feedbackMessage,
                    }) => (
                      <article
                        key={id}
                        className={`section-total-card ${
                          comparisonState === 'below'
                            ? 'section-total-card--below'
                            : 'section-total-card--on-track'
                        }`}
                      >
                        <header className="section-total-card__header">
                          <div className="section-total-card__labels">
                            <p className="section-total-card__section" title={section}>
                              {section}
                            </p>
                            <p className="section-total-card__name" title={subSection}>
                              {subSection}
                            </p>
                          </div>
                        </header>

                        <p className="section-total-card__score">
                          {total} <span>/ {max}</span>
                        </p>

                        <p
                          className={`section-total-card__feedback ${
                            comparisonState === 'below'
                              ? 'section-total-card__feedback--below'
                              : 'section-total-card__feedback--on-track'
                          }`}
                        >
                          {feedbackMessage}
                        </p>
                      </article>
                    ),
                  )}
                </div>
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
            </main>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={shellClassName}>
      {topNavbar}

      <div className="assessment-layout">
        <Card className="assessment-card">
          <main className="assessment-main">
            <header className="question-header">
              <div className="assessment-meta">
                <div className="assessment-meta__section-row">
                  <p className="question-header__section">{currentQuestion.section}</p>
                </div>
                <div className="assessment-meta__subsection-row">
                  <p className="question-header__subsection">{currentQuestion.subSection}</p>
                </div>
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
                    className={`choice-button ${isActive ? 'choice-button--active' : ''}`}
                    onClick={() => handleSelect(currentQuestion.id, currentIndex, level)}
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
          </main>
        </Card>
      </div>
    </div>
  )
}

export default App
