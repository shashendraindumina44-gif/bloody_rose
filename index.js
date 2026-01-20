const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function startBloodyRose() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        // මේ Browser Settings වෙනස් කිරීමෙන් "Couldn't Link" එක මගහැරිය හැක
        browser: ["Bloody Rose MD", "Safari", "3.0"]
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER;
        console.log("⏳ කේතය සාදමින් පවතිනවා... තත්පර 15ක් ඉන්න.");
        
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                console.log(`\n\n📢 ඔබගේ PAIRING CODE එක: ${code}\n\n`);
            } catch (err) {
                console.log("❌ Error: " + err.message);
            }
        }, 15000); 
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ සාර්ථකව සම්බන්ධ වුණා! දැන් බොට් වැඩ.');
        }
    });
}
startBloodyRose();
