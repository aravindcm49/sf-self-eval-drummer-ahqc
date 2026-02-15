# Salesforce Skill Self Evaluation

A lightweight React + TypeScript app for self-evaluating Salesforce skills across sections such as Platform Fundamentals, Apex, LWC, Security, Reporting, and Flows.

See `CONTRIBUTING.md` for contribution workflow, PR checklist, and content guidelines.

The app:
- asks one question at a time
- captures a self-rating (`Beginner`, `Intermediate`, `Advanced`)
- computes section-wise totals
- compares against expected scores by experience range (`0-3`, `3-6`, `6-9`)
- shows targeted coaching-style feedback on completion

## Tech Stack

- React
- TypeScript
- Vite

## Run Locally

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```

## Data Model

Primary content lives in:
- `src/data/questions.json`: all assessment questions
- `src/data/score-matrix.json`: expected scores per `section + subSection` and experience range

Typed validation wrappers:
- `src/data/questions.ts`
- `src/data/scoreMatrix.ts`

## Contributing Questions

We welcome community contributions, especially high-quality, practical questions.

### 1) Add a question

Add a new object in `src/data/questions.json` with:
- `id` (unique string, e.g. `q041`)
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

### 2) Update score expectations when needed

PR policy requires `src/data/questions.json` and `src/data/score-matrix.json` to be updated together.

If you create a new `section` or `subSection`, add a matching entry in `src/data/score-matrix.json`:

```json
{
  "id": "development-skills-new-topic",
  "section": "Development Skills",
  "subSection": "New Topic",
  "expected": { "0-3": 3, "3-6": 5, "6-9": 7 }
}
```

### 3) Validate locally

Before opening a PR:

```bash
npm run check:assessment-data
npm run lint
npm run build
```

## Contribution Guidelines

- Keep questions clear and scenario-driven.
- Avoid duplicate or near-duplicate questions.
- Prefer real-world phrasing over trivia-style prompts.
- Keep `section` and `subSection` naming consistent with existing taxonomy.
- Ensure question IDs are unique.

## Extending the Platform

If you want to go beyond question additions, we welcome contributions that improve learning-gap analysis and progression support, including:
- adaptive follow-up questions based on weak areas
- weighted scoring by criticality or skill depth
- confidence-aware scoring and calibration
- section-level recommendations with learning paths/resources
- historical progress tracking and trend analysis

If you are planning a larger feature, open an issue first with:
- problem statement
- proposed UX/data model
- rollout plan (small, reviewable PRs)

## Message to Contributors

This project is intentionally simple so more people can contribute quickly. If you want to add better question sets, richer gap analysis, or stronger guidance logic, that is absolutely welcome. Thoughtful improvements that make the assessment more practical and actionable are encouraged.
