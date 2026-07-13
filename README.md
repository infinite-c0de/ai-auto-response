# AI Auto Response

Google Apps Script that automatically replies to Without A Trace website contact form emails using OpenAI. Replies are personalized to the customer's message and follow Michael Ehrlich's business rules and tone.

## Files

| File | Description |
|------|-------------|
| `auto-reply.js` | Main auto-reply system — monitors Gmail, parses contact form emails, generates replies with OpenAI, and sends them in-thread every minute |
| `cleanup-old-emails.js` | Cleanup utility — moves `Web Requests` threads older than 20 days to Trash (run manually as needed) |

## Features

- Monitors Gmail for new web request / contact form emails
- Parses customer name, email, and message from form notifications
- Generates personalized replies via OpenAI (`gpt-4o-mini`)
- Appends shipping URL, store locations, and signature automatically
- **Test mode** — sends replies only to a test inbox
- **Live mode** — replies inside the original Gmail thread
- Labels error threads (`AI Auto Reply Error`)
- Rate limits: max 2 replies per run, checks up to 30 threads
- Emergency stop function to disable the time-based trigger
- Cleanup script to trash old `Web Requests` threads in batches

## Prerequisites

- A Google account with Gmail access
- An [OpenAI API key](https://platform.openai.com/api-keys)
- Website contact form emails delivered to Gmail (e.g. Contact Form 7 with `Reply-To: [your-email]`)
- Gmail label `Web Requests` (optional but recommended)

## Setup

### 1. Create the Apps Script project

1. Open [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Add two script files:
   - Paste `auto-reply.js` contents into `Code.gs` (or rename to `auto-reply.gs`)
   - Create a second file, paste `cleanup-old-emails.js` contents into it
4. Save the project

### 2. Add your OpenAI API key

1. In Apps Script: **Project Settings** (gear icon) → **Script Properties**
2. Add a property:
   - **Property:** `OPENAI_API_KEY`
   - **Value:** your OpenAI API key

### 3. Configure settings

Edit the `CONFIG` object at the top of `auto-reply.js`:

| Setting | Description |
|---------|-------------|
| `TEST_MODE` | `true` = send to test email only; `false` = reply in thread |
| `TEST_EMAIL` | Inbox used when `TEST_MODE` is `true` |
| `MICHAEL_EMAIL` | Reply-To address on outgoing emails |
| `SHIPPING_URL` | Link appended to every reply |
| `MAX_EMAILS_TO_SEND_PER_RUN` | Cap per 1-minute run (default: 2) |
| `MAX_THREADS_TO_CHECK` | How many threads to scan per run (default: 30) |

**Always start with `TEST_MODE: true`** until replies look correct.

### 4. Authorize and start

1. Run `testOpenAiApiKey` once to verify the API key
2. Run `setupAiAutoReplySystem` to:
   - Create Gmail labels
   - Clear old processing flags
   - Set a start timestamp (older emails are ignored)
   - Create a 1-minute time-based trigger

## How it works

```
Gmail (new web request) → find candidate threads → parse customer info
    → OpenAI generates reply → append business footer → send reply
    → label thread as processed
```

The script searches for emails matching subjects like "Without A Trace CONTACT FORM", "New submission from Garment Service Request", "Web Request", or threads under the `Web Requests` label. It skips replies, forwards, test messages, and emails received before setup.

```mermaid
flowchart LR
    A[Contact form email in Gmail] --> B[Time trigger every 1 min]
    B --> C[Find candidate threads]
    C --> D[Parse customer info]
    D --> E[OpenAI generates reply]
    E --> F{TEST_MODE?}
    F -->|Yes| G[Send to TEST_EMAIL]
    F -->|No| H[Reply in Gmail thread]
    G --> I[Label: Web Requests]
    H --> I
```

## Functions reference

### `auto-reply.js` — Auto-reply system

| Function | When to run |
|----------|-------------|
| `setupAiAutoReplySystem` | After saving code or resetting the system |
| `emergencyStopAiAutoReplySystem` | Stop the trigger immediately if something loops |
| `testOpenAiApiKey` | Verify OpenAI credentials |
| `autoSendAiRepliesForNewWebRequests` | Runs automatically every minute (do not run manually unless debugging) |

### `cleanup-old-emails.js` — Cleanup utility

| Function | When to run |
|----------|-------------|
| `moveOldWebRequestsEmailsToTrash` | Run manually to trash `Web Requests` threads older than 20 days (processes up to 1,000 threads per run in batches of 100) |

## Safety

- **Test mode first** — no customer emails until you are confident
- **Start time** — only emails after `setupAiAutoReplySystem` are processed
- **Duplicate protection** — script properties track processed message IDs
- **Lock** — only one run at a time
- **Error label** — failed threads get `AI Auto Reply Error` for review

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| `Missing OPENAI_API_KEY` | Add key in Script Properties |
| No replies sent | Confirm `TEST_MODE`, check Gmail search matches your form subject/body |
| Replies go to wrong address | Contact Form 7 Mail 1 should set `Reply-To: [customer-email]` |
| Too many emails | Run `emergencyStopAiAutoReplySystem`, then fix and re-run setup |
| OpenAI API error | Check API key, billing, and model availability |
| Old emails piling up | Run `moveOldWebRequestsEmailsToTrash` manually |

## Gmail labels used

- `AI Auto Reply Error` — processing failed, needs manual review
- `Web Requests` — applied to successfully replied threads (if the label exists)

## License

Private / internal use for Without A Trace.
