const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    cmd: ["hack"],
    execution: async (sock, m, from, args) => {
        try {
            let { key } = await sock.sendMessage(from, { text: "💀 Hacking Started..." });

            const hackSteps = [
                "📡 Connecting to WhatsApp Server...",
                "🔓 Bypassing Encryption...",
                "📂 Accessing Media & Chats...",
                "📧 Fetching Email & Passwords...",
                "⚠️ System Override in Progress...",
                "✅ HACK COMPLETE! 💀\n\n_Everything is under control._"
            ];

            for (let step of hackSteps) {
                await delay(2000);
                await sock.sendMessage(from, { text: step, edit: key });
                await sock.sendMessage(from, { react: { text: '💀', key: m.key } });
            }

        } catch (e) {
            console.log(e);
        }
    }
};