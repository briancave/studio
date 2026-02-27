# CLAUDE.md

## Project Overview

**SC Cargo Hauler** is a static web app for tracking cargo hauling runs in Star Citizen. Players select a ship, stack contracts onto a run, and track SCU usage, payouts, and efficiency metrics. Completed runs are saved to localStorage for historical analysis.

## Repository Structure

```
studio/
├── index.html           # Single-page app entry point
├── css/
│   └── style.css        # All styles — dark, industrial Star Citizen aesthetic
├── js/
│   ├── data.js          # Reference data: ships (SCU capacities), locations, commodities
│   └── app.js           # Core application logic, state management, localStorage persistence
├── CLAUDE.md            # This file — guidance for AI assistants
└── README.md            # Project readme
```

## Architecture

- **No build step** — open `index.html` directly in a browser or serve with any static file server
- **No dependencies** — vanilla HTML, CSS, and JavaScript only
- **Persistence** — `localStorage` keys: `sc-hauler-history` (completed runs), `sc-hauler-current` (in-progress run)
- **Data model**:
  - `SHIPS` / `LOCATIONS` / `COMMODITIES` arrays in `js/data.js`
  - Contracts: `{ id, commodity, scu, payout, pickup, dropoff, distance }`
  - Runs: `{ id, date, ship, maxScu, contracts[], totalScu, totalPayout, totalDistance }`

## Development Workflow

### Running locally

```sh
# Any static server works, for example:
python3 -m http.server 8000
# Then open http://localhost:8000
```

Or simply open `index.html` in a browser (file:// protocol works fine).

### Branching

- Default branch: `master`
- Feature branches should follow a descriptive naming convention

### Commits

- Write clear, concise commit messages
- Use imperative mood (e.g., "Add feature" not "Added feature")
- Keep commits focused on a single logical change

## Conventions

- Keep the repository clean — avoid committing generated files, build artifacts, or secrets
- No frameworks or package managers; keep the app dependency-free
- All HTML escaping uses the `esc()` helper in `app.js` to prevent XSS
- Update this CLAUDE.md as the project grows to reflect new structure, tooling, and conventions

## Key Notes for AI Assistants

- Read existing files before proposing modifications
- Prefer editing existing files over creating new ones when possible
- Ship, location, and commodity data lives in `js/data.js` — update there when adding new reference data
- All UI rendering is manual DOM manipulation in `js/app.js` — there is no virtual DOM or templating library
- The app auto-saves current run state and restores on reload via `saveCurrentRun()` / `restoreCurrentRun()`
- The `esc()` function must be used when inserting user-supplied text into innerHTML
