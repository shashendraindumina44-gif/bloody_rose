const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");

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

    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER;
        console.log("⏳ කේතය නිපදවමින් පවතිනවා... තත්පර 20ක් රැඳී සිටින්න.");
        
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                // කේතය පැහැදිලිව පෙන්වීමට format කිරීම
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n\n📢 ඔබගේ නව PAIRING CODE එක: ${code}\n\n`);
            } catch (err) {
                console.log("❌ වැරැද්දක් සිදුවුණා: " + err.message);
            }
        }, 20000); 
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (up) => {
        if (up.connection === 'open') console.log('✅ සාර්ථකව සම්බන්ධ වුණා!');
    });
}
startBloodyRose();
