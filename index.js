const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { Boom } = require("@hapi/boom");
const fs = require("fs");

async function startBloodyRose() {
    if (!fs.existsSync('./auth_info')) {
        fs.mkdirSync('./auth_info');
    }

    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
        },
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // 👇 ප්‍රශ්න අහන්නේ නැතුව කෙලින්ම කෝඩ් එක ඉල්ලනවා
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER; 
        
        if (!phoneNumber) {
            console.log("❌ කරුණාකර 'PHONE_NUMBER' Secret එක GitHub හි ඇතුළත් කරන්න.");
            process.exit(1);
        }

        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n\n🔴 ඔබගේ PAIRING CODE එක:  ${code}\n\n`);
            } catch (err) {
                console.log("❌ Pairing Code Error: " + err.message);
            }
        }, 5000); // තත්පර 5ක් ඉන්න
    }

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = (lastDisconnect.error instanceof Boom)?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) startBloodyRose();
        } else if (connection === 'open') {
            console.log('✅ BLOODY ROSE CONNECTED!');
        }
    });
}

startBloodyRose();
