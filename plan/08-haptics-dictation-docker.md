## Haptic Feedback

Use `navigator.vibrate()` for tactile feedback on mobile devices. Android only — iOS Safari does not support this API, so all calls are wrapped in a no-op guard. The app works identically on iOS, just without vibration.

**Helper** (`src/lib/haptics.ts`):
```typescript
function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}
```

**Interactions with haptic feedback:**
| Action | Pattern | Feel |
|--------|---------|------|
| Card added | `vibrate(30)` | Light tap — quick confirmation |
| Card deleted | `vibrate([40, 30, 40])` | Double pulse — warning feel |
| Card discussed | `vibrate(50)` | Medium tap — satisfying completion |
| Card skipped | `vibrate([20, 20, 20])` | Triple light — skip rhythm |
| Phase advanced | `vibrate(80)` | Strong tap — significant action |
| Retro completed | `vibrate([50, 50, 50, 50, 100])` | Celebration pattern |
| AI grouping done | `vibrate([30, 40, 30])` | Processing complete |
| Error action | `vibrate([100, 50, 100])` | Alert pattern |
| Timer 60-second mark | `vibrate(15)` | Subtle tick |
| Send card button press | `vibrate(20)` | Light tap on submit |

**Implementation**: Call `vibrate()` inside the existing event handlers (Server Action callbacks, SSE event handlers). No separate hook needed — just import and call at the right moments.

---

## Voice Dictation

Voice-to-text input using the browser's Web Speech API (`SpeechRecognition`). Users tap a mic button, speak, and transcribed text is appended to the input field. Locale-aware — recognizes Czech or English based on the app locale.

**Where it appears:**
- Card input (writing phase) — next to the emoji picker button
- Discussion notes textarea (discussing phase)
- Action item input (discussing phase)

**Hook** (`src/hooks/use-speech-recognition.ts`):
- Maps app locale to speech locale (`"cs"` → `"cs-CZ"`, `"en"` → `"en-US"`)
- Uses `webkitSpeechRecognition` (Chrome) with `SpeechRecognition` fallback (Safari)
- `continuous: false`, `interimResults: true` — single utterance, shows interim text
- Returns `{ isListening, isSupported, transcript, start, stop, toggle }`

**Component** (`src/components/retro/dictation-button.tsx`):
- Mic icon (idle) or MicOff icon with pulsing red ring (listening)
- Hidden if browser doesn't support Speech API (graceful degradation)
- Haptic feedback: `vibrate(20)` on start, `vibrate(30)` on transcript received

**Browser support**: Chrome (desktop + Android), Safari (iOS 14.5+ / macOS). Not supported on Firefox — button hidden.

---

## Docker Compose Services

```yaml
services:
  db:
    image: postgres:16-alpine
    ports: ["127.0.0.1:${DB_PORT:-5433}:5432"]
    volumes: [./data/postgres:/var/lib/postgresql/data]
    environment: { POSTGRES_DB: rekapka, POSTGRES_USER: rekapka, POSTGRES_PASSWORD: ${DB_PASSWORD} }
    healthcheck: pg_isready

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports: ["127.0.0.1:9000:9000", "127.0.0.1:9001:9001"]
    volumes: [./data/minio:/data]
    environment: { MINIO_ROOT_USER: ${S3_ACCESS_KEY}, MINIO_ROOT_PASSWORD: ${S3_SECRET_KEY} }

  minio-init:
    image: minio/mc:latest
    depends_on: { minio: { condition: service_healthy } }
    # Creates bucket and sets public read on photos/

  app:
    build: { context: ., dockerfile: Dockerfile }
    ports: ["127.0.0.1:3000:3000"]
    depends_on: { db: service_healthy, minio: service_healthy }
    environment: { DATABASE_URL, AUTH_SECRET, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, OPENAI_API_KEY, S3_ENDPOINT, ... }
```

