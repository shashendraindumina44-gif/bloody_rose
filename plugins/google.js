const axios = require('axios');

module.exports = {
    cmd: "google",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const text = args.join(' ');
            if (!text) return sock.sendMessage(from, { text: "❌ කරුණාකර සෙවිය යුතු දේ ලබා දෙන්න." });

            await sock.sendMessage(from, { react: { text: '🔍', key: m.key } });

            // සරල Google Search API එකක් භාවිතා කිරීම
            const res = await axios.get(`https://api.boxmine.xyz/search/google?query=${encodeURIComponent(text)}`);
            const results = res.data.result;

            if (!results || results.length === 0) return sock.sendMessage(from, { text: "❌ ප්‍රතිඵල කිසිවක් හමු නොවීය." });

            let msg = `🌹 *GOOGLE SEARCH RESULTS* 🌹\n\n🔍 *Query:* ${text}\n\n`;
            results.slice(0, 5).forEach((r, i) => {
                msg += `📍 *${i + 1}. ${r.title}*\n🔗 ${r.link}\n\n`;
            });

            await sock.sendMessage(from, { text: msg }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ Google සෙවුම අසාර්ථක විය." });
        }
    }
};
