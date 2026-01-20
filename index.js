const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");

// 1. Plugins Load කරන Function එක
const plugins = {};
const loadPlugins = () => {
    const pluginFolder = path.join(__dirname, 'plugins');
    const files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
    for (const file of files) {
        const plugin = require(path.join(pluginFolder, file));
        plugins[file.replace('.js', '')] = plugin;
    }
    console.log(`✅ ප්ලගින්ස් ${files.length}ක් සාර්ථකව Load වුණා!`);
};

async function startBloodyRose() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    // Pairing Code එකක් අවශ්‍ය නම් පමණක් පෙන්වයි
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER;
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n🔴 ඔබගේ PAIRING CODE එක: ${code}\n`);
        }, 5000);
    }

    // ප්ලගින්ස් ටික Load කරන්න
    loadPlugins();

    sock.ev.on('creds.update', saveCreds);

    // මැසේජ් කියවා ප්ලගින් එකට යොමු කිරීම
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        const mek = chatUpdate.messages[0];
        if (!mek.message || mek.key.remoteJid === 'status@broadcast') return;

        const body = mek.message.conversation || mek.message.extendedTextMessage?.text || "";
        const prefix = "."; // ඔයාගේ බොට්ගේ Prefix එක

        if (body.startsWith(prefix)) {
            const args = body.slice(prefix.length).trim().split(/ +/);
            const cmdName = args.shift().toLowerCase();

            // ප්ලගින් එකක් තිබේදැයි පරීක්ෂා කිරීම
            if (plugins[cmdName]) {
                try {
                    await plugins[cmdName].execute(sock, mek, args);
                } catch (e) {
                    console.error("Plugin Error: ", e);
                }
            }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('✅ BLOODY ROSE CONNECTED & PLUGINS READY!');
        }
    });
}

startBloodyRose();
