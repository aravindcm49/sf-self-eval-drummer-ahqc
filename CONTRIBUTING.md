# Contributing

Thanks for contributing to Salesforce Skill Self Evaluation.

This project accepts:
- question bank improvements
- scoring matrix refinements
- UX and accessibility improvements
- deeper learning-gap and coaching logic

## Prerequisites

- Node.js (recent LTS recommended)
- npm

## Local Setup

```bash
npm install
npm run dev
```

Validation commands:

```bash
npm run check:assessment-data
npm run lint
npm run build
```

## Ways to Contribute

1. Improve or add assessment questions.
2. Improve expected score thresholds per experience range.
3. Extend feedback and learning-gap analysis.
4. Fix bugs and improve UI/UX/accessibility.

## Adding or Updating Questions

Edit `src/data/questions.json`.

Each question must include:
- `id` (unique string, for example `q041`)
- `section`
- `subSection`
- `question`

Example:

```json
{
  "id": "q041",
  "section": "Development Skills",
  "subSection": "Apex Programming",
  "question": "Will I be able to design bulk-safe trigger logic for related updates?"
}
```

Rules:
- Keep wording clear and practical.
- Avoid duplicate or near-duplicate prompts.
- Keep section and subsection naming consistent.
- Ensure IDs are unique.

## Updating the Score Matrix

Edit `src/data/score-matrix.json`.

When required:
- PR policy requires `src/data/questions.json` and `src/data/score-matrix.json` to be updated together.
- If you add a new `section` or `subSection`, add a matching matrix entry.
- If you add questions to an existing `section + subSection`, adjust expected thresholds to keep scoring calibrated.

Example:

```json
{
  "id": "development-skills-new-topic",
  "section": "Development Skills",
  "subSection": "New Topic",
  "expected": { "0-3": 3, "3-6": 5, "6-9": 7 }
}
```

Expected values:
- Must be numeric.
- Must include all three ranges: `0-3`, `3-6`, `6-9`.

## Extending Learning-Gap Evaluation

We actively welcome enhancements beyond static questions, such as:
- adaptive follow-up questions for weak areas
- weighted scoring by topic importance
- confidence-aware scoring
- richer coaching/recommendation output
- progress history and trend tracking

For larger changes, open an issue first with:
- the problem being solved
- proposed data model and UX changes
- a small rollout plan

## Pull Request Checklist

Before opening a PR:

1. Run `npm run check:assessment-data`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Verify question IDs are unique.
5. Keep PR scope focused and reviewable.

## Review Expectations

PRs are reviewed for:
- correctness and regressions
- data consistency between questions and matrix
- clarity of question quality and taxonomy
- maintainability of code and structure

## Notes

If you are unsure about expected scoring values, open the PR with your best proposal and call out assumptions clearly. Discussion-first contributions are welcome.
