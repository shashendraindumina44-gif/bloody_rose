const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");

async function startBloodyRose() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // Pairing Code එක ගැනීමට උත්සාහ කිරීම
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER;
        console.log("⏳ Pairing Code එක ලබා ගැනීමට සූදානම් වෙනවා...");
        
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                console.log(`\n\n🔴 ඔබගේ PAIRING CODE එක: ${code}\n\n`);
            } catch (err) {
                console.log("❌ කරුණාකර නැවත 'Run Workflow' කරන්න: " + err.message);
            }
        }, 15000); // තත්පර 15ක් පමාවී කෝඩ් එක ඉල්ලයි
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(`🔄 සම්බන්ධතාවය බිඳ වැටුණා (Reason: ${reason}). නැවත උත්සාහ කරනවා...`);
            startBloodyRose();
        } else if (connection === 'open') {
            console.log('✅ BLOODY ROSE සාර්ථකව සම්බන්ධ වුණා!');
        }
    });
}

startBloodyRose();
