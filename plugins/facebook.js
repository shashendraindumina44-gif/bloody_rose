const axios = require('axios');

module.exports = {
    cmd: "fb",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            // Args වලින් URL එක ලබා ගැනීම
            const url = args[0];
            if (!url) return sock.sendMessage(from, { text: "📝 කරුණාකර Facebook වීඩියෝ ලින්ක් එක ලබා දෙන්න." }, { quoted: m });

            // මූලික ලින්ක් පරීක්ෂාව
            if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
                return sock.sendMessage(from, { text: "❌ මෙය වලංගු Facebook වීඩියෝ ලින්ක් එකක් නොවේ." }, { quoted: m });
            }

            // Reaction එකක් දැමීම
            await sock.sendMessage(from, { react: { text: '⏳', key: m.key } });

            // 🌐 ස්ථාවර API එකක් හරහා Data ලබා ගැනීම
            // මෙහිදී 'api.boxmine.xyz' වැනි පොදු API එකක් භාවිතා කර ඇත
            const apiRes = await axios.get(`https://api.boxmine.xyz/downloader/facebook?url=${encodeURIComponent(url)}`);
            const res = apiRes.data;

            if (!res || !res.status || !res.result) {
                return sock.sendMessage(from, { text: "❌ වීඩියෝව සොයා ගැනීමට නොහැකි විය. (Private වීඩියෝ බාගත කළ නොහැක)" }, { quoted: m });
            }

            // HD හෝ SD ලින්ක් එක තෝරා ගැනීම
            const directUrl = res.result.hd || res.result.sd;
            if (!directUrl) {
                return sock.sendMessage(from, { text: "❌ බාගත හැකි ලින්ක් එකක් හමු නොවීය." }, { quoted: m });
            }

            // වීඩියෝව Download කිරීම
            const videoRes = await axios.get(directUrl, {
                responseType: "arraybuffer",
                headers: {
                    "User-Agent": "Mozilla/5.0",
                }
            });

            // 📦 ප්‍රමාණය පරීක්ෂා කිරීම (WhatsApp Limit: 64MB)
            const size = videoRes.data.length;
            if (size > 60 * 1024 * 1024) {
                return sock.sendMessage(from, { text: `❌ වීඩියෝව ඉතා විශාලයි: ${(size / 1024 / 1024).toFixed(2)} MB` }, { quoted: m });
            }

            // 📤 වීඩියෝව යැවීම
            await sock.sendMessage(from, {
                video: Buffer.from(videoRes.data),
                mimetype: "video/mp4",
                caption: `🌹 *FACEBOOK DOWNLOADER*\n\n📝 *Title:* ${res.result.title || 'FB Video'}\n\n🌹 *Bloody Rose Bot*`
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: `❌ දෝෂයක් ඇති විය: ${e.message}` }, { quoted: m });
        }
    }
};
