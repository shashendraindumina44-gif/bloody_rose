const axios = require('axios');

module.exports = {
    cmd: "tiktok",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const url = args[0];
            if (!url) return sock.sendMessage(from, { text: "📝 කරුණාකර TikTok වීඩියෝ ලින්ක් එක ලබා දෙන්න." }, { quoted: m });

            // TikTok ලින්ක් එකක්දැයි මූලික පරීක්ෂාව
            if (!url.includes('tiktok.com')) return sock.sendMessage(from, { text: "❌ මෙය වලංගු TikTok ලින්ක් එකක් නොවේ." }, { quoted: m });

            await sock.sendMessage(from, { react: { text: '⏳', key: m.key } });

            // 🌐 TikWM API එක භාවිතා කිරීම (වඩාත් ස්ථාවරයි)
            const response = await axios.get(`https://www.tikwm.com/api/?url=${url}`);
            const res = response.data;

            if (!res || res.code !== 0) {
                return sock.sendMessage(from, { text: "❌ වීඩියෝව සොයා ගැනීමට නොහැකි විය. ලින්ක් එක පරීක්ෂා කරන්න." }, { quoted: m });
            }

            const data = res.data;
            const videoUrl = data.play; // No Watermark video URL
            const title = data.title || "TikTok Video";

            // වීඩියෝව Download කිරීම
            const videoRes = await axios.get(videoUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(videoRes.data);

            // 📦 ප්‍රමාණය පරීක්ෂා කිරීම (WhatsApp සීමාවන් නිසා 60MB වලට වඩා වැඩි නම් යවන්න බැහැ)
            if (buffer.length > 60 * 1024 * 1024) {
                return sock.sendMessage(from, { text: "❌ වීඩියෝව ඉතා විශාලයි (60MB ඉක්මවා ඇත)." }, { quoted: m });
            }

            // 📤 වීඩියෝව යැවීම
            await sock.sendMessage(from, {
                video: buffer,
                mimetype: "video/mp4",
                caption: `🌹 *TIKTOK DOWNLOADER* 🌹\n\n📝 *Title:* ${title}\n👤 *Author:* ${data.author.nickname}\n\n🌹 *Bloody Rose Bot*`
            }, { quoted: m });

            await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: `❌ TikTok වීඩියෝව ලබා ගැනීම අසාර්ථක විය.` }, { quoted: m });
        }
    }
};
