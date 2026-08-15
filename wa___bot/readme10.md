# WhatsApp Group Lookup — Baileys version

Same feature set as the `whatsapp-web.js` version (scan a QR code to link
your WhatsApp account, then look up a group's participants by name), but
built on [`@whiskeysockets/baileys`](https://baileys.wiki/) instead.

## Why this exists

`whatsapp-web.js` automates a real headless Chromium instance running
WhatsApp Web, so it breaks whenever WhatsApp ships a frontend/markup update
that its injected script doesn't expect — which is exactly the `getChats()`
"r: r" error you hit. Baileys instead re-implements WhatsApp's multi-device
**protocol** directly over a WebSocket, with no browser involved, so it's
far less exposed to that class of breakage (though as an unofficial client
it can still break when WhatsApp changes the underlying protocol itself).

Same caveat as before: this automates a personal account outside WhatsApp's
official API and outside their ToS. Keep usage to light, read-only lookups
like this rather than bulk/automated messaging.

## Setup

```bash
cd whatsapp-baileys-group-lookup
npm install
npm start
```

Requires **Node.js 20+** — Baileys enforces this at install time. Then open
`http://localhost:3000` and scan the QR with **WhatsApp → Settings →
Linked Devices → Link a Device** on your phone.

Your session is cached in `.baileys_auth/`, so restarts won't require a
rescan (delete that folder to force a fresh login).

## API

Same shape as the `whatsapp-web.js` version:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | Current auth status + QR data URL while pending |
| GET | `/api/groups` | List all group names on the account |
| GET | `/api/groups/:name/participants` | Participants of a group, matched by exact then partial name |

```json
{
  "group": "Family Trip 2026",
  "participantCount": 3,
  "participants": [
    { "number": "15551234567", "isAdmin": true, "isSuperAdmin": true },
    { "number": "15557654321", "isAdmin": false, "isSuperAdmin": false }
  ]
}
```

**Note on names and numbers:** each participant response includes:
- `number` — a phone number when WhatsApp shares one, otherwise a LID (see below)
- `isPhoneNumber` — `true` if `number` is a real phone number, `false` if it's an opaque LID
- `name` — a saved contact name or the person's own pushname, when known; `null` otherwise

**Where names come from:** `groupFetchAllParticipating()` on its own only
returns ids and admin role, not names — that's why every `name` was `null`
before. Names arrive separately, mainly through WhatsApp's history sync on
connect (`syncFullHistory: true` is set for this) and through `contacts.upsert`
/ `contacts.update` events as they trickle in afterward. This code builds a
small in-memory cache from those events, keyed by every id form seen (PN and
LID) for a contact, and looks a participant up under whichever form of their
id it has.

Two practical implications:
- **Right after linking**, the cache may still be filling in — if you query
  a group immediately after scanning the QR, you may see more `null` names
  than after waiting ~10–30s (history sync takes a moment) or querying again
  a bit later.
- **You'll only ever see a name for someone WhatsApp has told you about** —
  people you've saved as a contact, whose pushname you've seen, or who
  you've messaged/been in a chat with. For a large group of strangers,
  some entries may permanently stay `null`, which mirrors what WhatsApp
  itself shows you for people outside your contacts.

**Why some participants show a long numeric ID instead of a phone number:**
WhatsApp has been rolling out **LIDs** (Linked IDs) — opaque per-user identifiers that hide real phone numbers in groups, communities, and channels. This is a WhatsApp privacy feature, not a bug: some groups (especially larger ones, or ones with "hide phone numbers" / Community privacy settings) show participants as a LID instead of a number. Per Baileys' own docs, **LID → phone number resolution is one-directional and not generally supported** — you can resolve a phone number to its LID, but not reliably the reverse, unless Baileys has independently seen that mapping already (e.g. from a prior direct message from that person). This code exposes `jid` (the real phone-number counterpart) when WhatsApp does share it, and otherwise honestly labels the entry as a LID rather than presenting it as if it were a phone number.

## Troubleshooting

- **Stuck disconnecting/reconnecting in a loop**: delete `.baileys_auth/`
  and rescan — a corrupted or expired session is the usual cause.
- **`DisconnectReason.loggedOut`**: you unlinked the device from your phone
  (or WhatsApp force-logged it out). Delete `.baileys_auth/` and relink.
- **Version conflicts**: this is pinned to the `6.7.x` line, which is
  stable and widely documented. `@whiskeysockets/baileys@7.x` exists with
  breaking API changes if you want to track the bleeding edge later.