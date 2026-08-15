const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const { Boom } = require('@hapi/boom');
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidDecode,
} = require('@whiskeysockets/baileys');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

let latestQrDataUrl = null;
// starting -> qr -> ready (or disconnected)
let status = 'starting';
let sock = null;

async function startSock() {
  const { state, saveCreds } = await useMultiFileAuthState('./.baileys_auth');

  sock = makeWASocket({
    auth: state,
    browser: ['Chrome (Linux)', 'Chrome', '120.0.0'],
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      status = 'qr';
      latestQrDataUrl = await QRCode.toDataURL(qr);
      console.log('New QR code generated — open the app in your browser to scan it.');
    }

    if (connection === 'open') {
      status = 'ready';
      latestQrDataUrl = null;
      console.log('WhatsApp connected.');
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error instanceof Boom ? lastDisconnect.error.output?.statusCode : null;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      status = 'disconnected';
      console.log('Connection closed.', lastDisconnect?.error?.message || '');

      if (!loggedOut) {
        console.log('Reconnecting...');
        startSock();
      } else {
        console.log('Logged out — delete .baileys_auth and restart the server to relink.');
      }
    }
  });
}

startSock();

// ---- Poll this from the frontend to drive the QR / ready UI
app.get('/api/status', (req, res) => {
  res.json({ status, qrDataUrl: status === 'qr' ? latestQrDataUrl : null });
});

// ---- List all WhatsApp group chat names this account belongs to
app.get('/api/groups', async (req, res) => {
  if (status !== 'ready') {
    return res.status(409).json({ error: 'WhatsApp client is not ready yet. Scan the QR code first.' });
  }
  try {
    const groups = await sock.groupFetchAllParticipating();
    res.json({ groups: Object.values(groups).map((g) => g.subject) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// ---- Get participants of a group, matched by name (exact, then partial)
app.get('/api/groups/:name/participants', async (req, res) => {
  if (status !== 'ready') {
    return res.status(409).json({ error: 'WhatsApp client is not ready yet. Scan the QR code first.' });
  }

  const wanted = req.params.name.trim().toLowerCase();

  try {
    const groups = await sock.groupFetchAllParticipating();
    const groupList = Object.values(groups);

    let group = groupList.find((g) => g.subject.toLowerCase() === wanted);
    if (!group) {
      group = groupList.find((g) => g.subject.toLowerCase().includes(wanted));
    }

    if (!group) {
      return res.status(404).json({
        error: `No group found matching "${req.params.name}"`,
        availableGroups: groupList.map((g) => g.subject),
      });
    }

    // WhatsApp increasingly hides real phone numbers behind an opaque "LID"
    // (privacy identifier) for group participants — this shows up as a long
    // numeric id that isn't a phone number at all. Baileys exposes the real
    // phone-number JID separately as `jid` when WhatsApp shares it; fall
    // back to decoding `id` (never split JIDs with string ops — see
    // https://baileys.wiki/concepts/jids).
    const participants = group.participants.map((p) => {
      const phoneJid = p.jid || (jidDecode(p.id)?.server === 's.whatsapp.net' ? p.id : null);
      const decoded = jidDecode(phoneJid || p.id);
      return {
        number: decoded?.user ?? p.id,
        isPhoneNumber: decoded?.server === 's.whatsapp.net',
        name: p.name || p.notify || null,
        isAdmin: p.admin === 'admin' || p.admin === 'superadmin',
        isSuperAdmin: p.admin === 'superadmin',
      };
    });

    res.json({ group: group.subject, participantCount: participants.length, participants });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch group participants' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Open http://localhost:${PORT} to scan the QR code`));
