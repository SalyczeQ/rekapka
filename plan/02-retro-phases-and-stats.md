## Retro Phase Flow

```
Writing → Discussing → Completed
```

Only 3 phases. No draft gate, no grouping gate. Simple and fast.

- **Writing**: Retro starts here immediately after creation. `startedAt` set on creation. Users add cards to Mad/Sad/Glad categories. Privacy: you see your own text; others show as card count only. Cards are editable/deletable. Emoji `:shortcode:` syntax auto-replaces. Retro metadata (title, date, location, photo) editable anytime via an edit button in the header. AI grouping available as an optional button — not a separate phase. When ready, advance to Discussing.
- **Discussing**: Cards shown one at a time in fair round-robin order. Card text is blurred until clicked. Per-card count-up timer. Buttons: "Mark Discussed" (removes from queue) and "Skip" (moves to end). Action items can be created inline during discussion. AI grouping button still available here if not used during writing.
- **Completed**: Confetti animation. Instant stats shown immediately. Form to create next retro. Undiscussed cards automatically carry over to the new retro. "View Full Stats" link for detailed + AI analysis page.

### Fair Card Sorting (Round-Robin)
Group cards by author. Sort authors by card count descending (most cards first). Interleave one card per author per round. Within each author, order by `createdAt` ascending.

Example: Authors A(3 cards), B(2), C(4) → C1, A1, B1, C2, A2, B2, C3, A3, C4

### Stats Page (generated on completion, cached in `statsCache`)

**Time & Duration**
- Total retro duration (startedAt → completedAt)
- Time spent writing vs discussing
- Average discussion time per card
- Longest discussed card (which card + how long)
- Median discussion time

**Cards**
- Total cards written
- Cards per category (Mad / Sad / Glad breakdown — bar or pie chart)
- Cards discussed vs skipped vs carried over
- Most popular category (which got the most cards)
- Average card length (words)
- Longest card text (which card)

**People**
- Most cards written (who + count)
- Most verbose author (who wrote the most total text)
- Most discussed author (whose cards took the longest total discussion time)
- Cards per person breakdown
- Who created the most action items

**Discussion**
- Number of cards skipped
- Discussion time distribution (how many cards took <1min, 1-3min, 3-5min, 5min+)

**AI / Content (LLM-generated)**
- Theme summary (what topics came up)
- Sentiment breakdown (positive/negative/neutral ratio across categories)
- AI group names and sizes (if grouping was used)
- Key takeaways

**Action Items**
- Total action items created

**Trends** (shown after 2+ retros exist)
- Card count trend over last N retros
- Duration trend
- Mad/Sad/Glad ratio trend (are things getting better?)
- Action item completion rate from previous retros

### Team Stats Page (`/stats`)

A separate page accessible to all users showing aggregated metrics across all retros. Available from the sidebar navigation. Has a **time range filter** at the top: "Last 5 retros", "Last 3 months", "Last 6 months", "All time" (default).

**Team Health Trends**
- Mad/Sad/Glad ratio over time (line chart) — more Glad over time = healthier team
- Total cards per retro trend (line chart) — is engagement growing or declining?
- Cards per person per retro (line chart per user) — individual engagement over time
- Carry-over card count per retro — how many cards never get discussed?

**Participation**
- Participation rate per user (how many retros each person joined, based on cards written)
- Most active contributor overall (total cards across all retros)
- Average cards per person per retro
- Who gets discussed the most (total discussion time spent on their cards)

**Action Items**
- Completion rate overall (done / total, as percentage)
- Open action items right now (across all retros, not yet done) — list with assignees
- Average action items per retro
- Most assigned person
- Overdue action items (past due date, still open)

**Discussion**
- Average discussion time per card over retros (trend line)
- Skip rate trend (% skipped per retro)
- Most skipped category (does one category always get skipped?)

**Timing**
- Average retro duration
- Duration trend (line chart)
- Longest and shortest retro (with links)
- Average time between retros (cadence — e.g., "every 2.1 weeks")
- Day of week distribution (bar chart — when do you usually retro?)

**Content / Tags**
- Most used tags (ranked list or tag cloud)

**AI Analysis (on-demand, cached)**
- "Generate AI Analysis" button — calls `POST /api/ai/team-stats` with retro IDs in selected time range
- Shows loading state while OpenAI processes
- Once generated, displays:
  - Most recurring themes across retros (what keeps coming up?)
  - Sentiment trend over time (is the team mood improving?)
  - Topics that keep coming back unresolved (patterns the team should address)
  - Summary of progress and recommendations
- Cached in `appSettings` or a dedicated cache field. Invalidated when time range changes or new retro is completed. Subsequent visits with same range are instant.

