const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    fetchLatestBaileysVersion,
    Browsers
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const config = require('./config');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startBloodyRose() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        printQRInTerminal: false,
        logger: pino({ level: "fatal" }),
        browser: Browsers.macOS("Chrome"), 
        generateHighQualityLinkPreview: true,
    });

    if (!sock.authState.creds.registered) {
        console.clear();
        console.log("🌹 BLOODY ROSE MD - POWERED BY SENURI");
        let phoneNumber = await question('✍️ Phone Number (Ex: 947xxxxxxxx): ');
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        if (phoneNumber.length < 10) { process.exit(0); }
        await delay(2000);
        const code = await sock.requestPairingCode(phoneNumber);
        console.log(`\n👉 YOUR PAIRING CODE: ${code}\n`);
    }

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") console.log("\n✅ Bot is Online! Working for Everyone including Owner.");
        if (connection === "close") {
            let reason = lastDisconnect.error ? lastDisconnect.error.output.statusCode : 0;
            if (reason !== DisconnectReason.loggedOut) startBloodyRose();
        }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m.message) return;

            const from = m.key.remoteJid;
            const messageType = Object.keys(m.message)[0];
            let body = (messageType === 'conversation') ? m.message.conversation : 
                         (messageType === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                         (messageType === 'imageMessage') ? m.message.imageMessage.caption : 
                         (messageType === 'videoMessage') ? m.message.videoMessage.caption : '';

            if (!body) body = "";
            const textInput = body.toLowerCase();
            const prefix = config.prefix || ".";

            // --- 💖 SENURI LOGIC (Works for Owner too) ---
            if (textInput.includes("senuri") || textInput.includes("සෙනුරි")) {
                const senuriPath = path.join(__dirname, 'plugins', 'senuri.js');
                if (fs.existsSync(senuriPath)) {
                    delete require.cache[require.resolve(senuriPath)];
                    const senuriPlugin = require(senuriPath);
                    await senuriPlugin.execution(sock, m, from, [body], config);
                    return; // සෙනුරි වැඩ කළොත් මෙතනින් නවත්වනවා (Double Msg Fix)
                }
            }

            // --- 🛠️ COMMAND HANDLER ---
            if (body.startsWith(prefix)) {
                const args = body.slice(prefix.length).trim().split(/ +/);
                const cmdName = args.shift().toLowerCase();
                const pluginPath = path.join(__dirname, 'plugins');
                const pluginFiles = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js'));

                for (const file of pluginFiles) {
                    const fullPath = path.join(pluginPath, file);
                    const plugin = require(fullPath);
                    const isCmd = Array.isArray(plugin.cmd) ? plugin.cmd.includes(cmdName) : plugin.cmd === cmdName;

                    if (isCmd) {
                        await plugin.execution(sock, m, from, args, config);
                        break; 
                    }
                }
            }
        } catch (err) { console.error("Error: ", err); }
    });
}

startBloodyRose();