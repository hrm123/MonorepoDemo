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

**Note on names:** unlike the `whatsapp-web.js` version, this doesn't return
a display name per participant — Baileys (and WhatsApp's protocol) doesn't
expose other users' names to you unless you've saved their contact
yourself. Only phone numbers and admin role are available out of the box.
If you need names, you'd extend this to build a local contact map from your
own saved contacts, or store `pushname` values as messages come in via the
`messages.upsert` event.

**Note on identifiers:** recent WhatsApp changes have introduced "LID"
(a privacy identifier) alongside phone numbers for some participants.
Depending on the group and Baileys version, `p.id` may occasionally be a
LID rather than a raw phone number — this is a WhatsApp-side privacy
feature, not a bug in this code.

## Troubleshooting

- **Stuck disconnecting/reconnecting in a loop**: delete `.baileys_auth/`
  and rescan — a corrupted or expired session is the usual cause.
- **`DisconnectReason.loggedOut`**: you unlinked the device from your phone
  (or WhatsApp force-logged it out). Delete `.baileys_auth/` and relink.
- **Version conflicts**: this is pinned to the `6.7.x` line, which is
  stable and widely documented. `@whiskeysockets/baileys@7.x` exists with
  breaking API changes if you want to track the bleeding edge later.
