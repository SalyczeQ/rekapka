# Predictions & Bets

## What Is It

A feature for tracking predictions and friendly bets between retro sessions. "I bet X will happen by next retro" — created during one retro, resolved at the next. Adds a fun accountability layer to the group.

## Why

The group already makes informal bets (Petr's beer bet with Matěj, predictions about AI replacing jobs, BTC prices, etc.). Currently these get lost in conversation. Tracking them makes retros more engaging and creates a fun history of who was right.

---

## Database Schema

### `predictions`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| retroId | uuid FK → retros (cascade) | Retro where prediction was made |
| resolvedInRetroId | uuid FK → retros (set null), nullable | Retro where it was resolved |
| authorId | uuid FK → users (restrict) | Who made the prediction |
| text | text | The prediction/bet text |
| stake | text, nullable | What's at stake ("pivo", "100 Kč", "bragging rights") |
| challengedUserId | uuid FK → users (set null), nullable | Who accepted the bet (null = open prediction) |
| status | text, default `open` | `open`, `correct`, `wrong`, `cancelled` |
| resolvedAt | timestamptz, nullable | When resolved |
| resolvedBy | uuid FK → users (set null), nullable | Who resolved it |
| createdAt, updatedAt | timestamptz | |

---

## User Flow

### Creating a Prediction (during Writing or Discussing phase)

1. User taps "Add Prediction" button (available alongside card input)
2. Fills in:
   - **Prediction text** (required): "BTC will hit 150k by next retro"
   - **Stake** (optional): "pivo" / "100 Kč" / free text
   - **Challenge** (optional): select a specific person to bet against
3. Prediction is saved and visible to all participants
4. SSE broadcasts `prediction_added` event

### Viewing Predictions (during any phase)

- A "Predictions" section/tab on the retro page showing:
  - **Open predictions** from previous retros (need resolving)
  - **New predictions** made in this retro
  - Each shows: text, author, stake, challenged person, status

### Resolving Predictions (at start of next retro)

- When entering a new retro, unresolved predictions from past retros are shown
- The author or challenged user can mark each as:
  - ✅ **Correct** — prediction came true
  - ❌ **Wrong** — didn't happen
  - 🚫 **Cancelled** — no longer relevant
- Resolution is recorded with `resolvedInRetroId` linking to the current retro

### Stats Integration

- **Prediction accuracy** per user on team stats page
- **Best predictor** — who has the highest correct rate
- **Open bets** count shown on dashboard

---

## UI Components

### `PredictionInput` (Client Component)
- Text input + optional stake + optional user selector
- Submit calls `createPrediction` server action
- Available in both writing and discussing phases

### `PredictionList` (Client Component)
- Shows predictions grouped by:
  - "Unresolved from past retros" (with resolve buttons)
  - "Made this retro" (new predictions)
- Each prediction card shows:
  - Author avatar + name
  - Prediction text
  - Stake badge (if any)
  - Challenged user (if any)
  - Status badge (open/correct/wrong)
  - Resolve buttons (for author or challenged user)

### `PredictionSection` (wrapper)
- Collapsible section on the retro page
- Badge showing count of unresolved predictions
- Placed below the card input area

---

## API & Actions

### Server Actions (`src/lib/actions/predictions.ts`)
- `createPrediction(formData)` — create new prediction
- `resolvePrediction(predictionId, status)` — mark as correct/wrong/cancelled

### SSE Events
- `prediction_added` — new prediction created
- `prediction_resolved` — prediction status changed

---

## Implementation Phases

### Phase 1: Schema + CRUD
- Add `predictions` table to schema
- Generate migration
- Create server actions for create + resolve
- Add SSE event types

### Phase 2: UI - Creating Predictions
- `PredictionInput` component
- Add to writing and discussing phases
- Real-time sync via SSE

### Phase 3: UI - Viewing & Resolving
- `PredictionList` component with resolve buttons
- Show unresolved predictions from past retros
- `PredictionSection` wrapper with collapse

### Phase 4: Stats Integration
- Add prediction accuracy to team stats page
- "Best Predictor" metric
- Open bets count on dashboard

### Phase 5: Polish
- Translations (CS + EN)
- Haptic feedback on resolve
- Mobile viewport testing

---

## File Structure

```
src/lib/actions/predictions.ts          — Server actions (create, resolve)
src/components/retro/prediction-input.tsx — Input form for new predictions
src/components/retro/prediction-list.tsx  — List with resolve buttons
src/components/retro/prediction-section.tsx — Collapsible wrapper
src/app/api/ai/... (no AI needed)
src/types/realtime.ts                    — Add prediction SSE events
src/lib/db/schema.ts                     — Add predictions table
drizzle/XXXX_add_predictions.sql         — Migration
```

---

## Translations

### English
```json
"predictions": {
  "title": "Predictions & Bets",
  "addPrediction": "Add Prediction",
  "predictionPlaceholder": "I bet that…",
  "stake": "Stake",
  "stakePlaceholder": "pivo, 100 Kč…",
  "challenge": "Challenge",
  "unresolved": "Unresolved from past retros",
  "thisRetro": "Made this retro",
  "correct": "Correct",
  "wrong": "Wrong",
  "cancelled": "Cancelled",
  "open": "Open",
  "resolve": "Resolve",
  "noPredictions": "No predictions yet",
  "accuracy": "Prediction accuracy",
  "bestPredictor": "Best Predictor"
}
```

### Czech
```json
"predictions": {
  "title": "Předpovědi a sázky",
  "addPrediction": "Přidat předpověď",
  "predictionPlaceholder": "Vsadím se, že…",
  "stake": "V sázce",
  "stakePlaceholder": "pivo, 100 Kč…",
  "challenge": "Vyzvat",
  "unresolved": "Nevyřešené z minulých retr",
  "thisRetro": "Z tohoto retra",
  "correct": "Správně",
  "wrong": "Špatně",
  "cancelled": "Zrušeno",
  "open": "Otevřená",
  "resolve": "Vyřešit",
  "noPredictions": "Zatím žádné předpovědi",
  "accuracy": "Přesnost předpovědí",
  "bestPredictor": "Nejlepší věštec"
}
```
