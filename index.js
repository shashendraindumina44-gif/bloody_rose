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
const path = require("path");

// 1. ප්ලගින්ස් ගබඩා කිරීමට Object එකක්
const plugins = {};

// 2. Plugins ලෝඩ් කරන Function එක
const loadPlugins = () => {
    const pluginFolder = path.join(__dirname, 'plugins');
    if (fs.existsSync(pluginFolder)) {
        const files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
        for (const file of files) {
            try {
                const plugin = require(path.join(pluginFolder, file));
                plugins[file.replace('.js', '')] = plugin;
            } catch (e) {
                console.log(`❌ ${file} ප්ලගිනය ලෝඩ් කිරීමට නොහැක:`, e.message);
            }
        }
        console.log(`✅ ප්ලගින්ස් ${Object.keys(plugins).length}ක් සූදානම්!`);
    }
};

async function startBloodyRose() {
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
        // "Couldn't Link" දෝෂය මඟහැරීමට Browser එක වෙනස් කරන ලදී
        browser: ["Bloody Rose MD", "Chrome", "1.0.0"]
    });

    // ප්ලගින්ස් ලෝඩ් කරන්න
    loadPlugins();

    // Pairing Code එකක් අවශ්‍ය නම් පමණක් පෙන්වයි
    if (!sock.authState.creds.registered) {
        const phoneNumber = process.env.PHONE_NUMBER; 
        if (!phoneNumber) {
            console.log("❌ කරුණාකර 'PHONE_NUMBER' Secret එක GitHub හි ඇතුළත් කරන්න.");
            process.exit(1);
        }

        console.log("⏳ කේතය නිපදවමින් පවතිනවා... තත්පර 15ක් රැඳී සිටින්න.");
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n\n📢 ඔබගේ PAIRING CODE එක: ${code}\n\n`);
            } catch (err) {
                console.log("❌ Pairing Code ලබා ගැනීමට නොහැක: " + err.message);
            }
        }, 15000);
    }

    sock.ev.on('creds.update', saveCreds);

    // මැසේජ් කියවීම සහ Command එක ක්‍රියාත්මක කිරීම
    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message || mek.key.remoteJid === 'status@broadcast') return;

            const body = mek.message.conversation || mek.message.extendedTextMessage?.text || mek.message.imageMessage?.caption || "";
            const prefix = "."; // ඔබට අවශ්‍ය Prefix එක මෙහි යොදන්න

            if (body.startsWith(prefix)) {
                const args = body.slice(prefix.length).trim().split(/ +/);
                const cmdName = args.shift().toLowerCase();

                if (plugins[cmdName]) {
                    await plugins[cmdName].execute(sock, mek, args);
                    console.log(`🚀 Command Executed: ${cmdName}`);
                }
            }
        } catch (e) {
            console.log("Message Error: " + e);
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBloodyRose();
        } else if (connection === 'open') {
            console.log('✅ BLOODY ROSE සාර්ථකව සම්බන්ධ වුණා!');
        }
    });
}

startBloodyRose();
