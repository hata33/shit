# gstack

This project uses gstack for AI engineering workflows.

## Web Browsing

**Always use the `/browse` skill from gstack for all web browsing.** NEVER use `mcp__claude-in-chrome__*` tools — they are slow, unreliable, and not what this project uses.

## Available Skills

- `/office-hours` — YC Office Hours (startup diagnostic + builder brainstorm)
- `/plan-ceo-review` — CEO/founder-mode plan review
- `/plan-eng-review` — Eng manager-mode plan review (architecture, data flow, diagrams, edge cases, test coverage, performance)
- `/plan-design-review` — Designer's eye plan review
- `/design-consultation` — Design system from scratch
- `/review` — Pre-landing PR review
- `/ship` — Ship workflow (detect + merge base branch, run tests, review diff, bump VERSION, update CHANGELOG, commit, push, create PR)
- `/land-and-deploy` — Land and deploy workflow (merge PR, wait for CI and deploy, verify production health via canary checks)
- `/canary` — Post-deploy canary monitoring
- `/benchmark` — Performance regression detection
- `/browse` — Fast headless browser for QA testing and site dogfooding
- `/qa` — Systematically QA test a web application and fix bugs found
- `/qa-only` — Report-only QA testing (no fixes)
- `/design-review` — Designer's eye QA (finds visual inconsistency, spacing issues, hierarchy problems, AI slop patterns)
- `/setup-browser-cookies` — Import cookies from your real browser into the headless browse session
- `/setup-deploy` — Configure deployment settings for /land-and-deploy
- `/retro` — Weekly engineering retrospective
- `/investigate` — Systematic debugging with root cause investigation
- `/document-release` — Post-ship documentation update
- `/codex` — OpenAI Codex CLI wrapper (code review, challenge, consult)
- `/cso` — Chief Security Officer mode (infrastructure-first security audit)
- `/careful` — Safety guardrails for destructive commands
- `/freeze` — Restrict file edits to a specific directory
- `/guard` — Full safety mode (destructive command warnings + directory-scoped edits)
- `/unfreeze` — Clear the freeze boundary set by /freeze
- `/gstack-upgrade` — Upgrade gstack to the latest version

## Troubleshooting

If gstack skills aren't working, run the setup script to build the binary and register skills:

```bash
cd .claude/skills/gstack && ./setup
```

This requires bun to be installed (`curl -fsSL https://bun.sh/install | bash`).
