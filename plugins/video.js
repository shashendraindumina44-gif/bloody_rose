const yts = require('yt-search');

module.exports = {
    cmd: ["video", "ytv"],
    execution: async (sock, m, from, args) => {
        try {
            const text = args.join(' ');
            if (!text) return sock.sendMessage(from, { text: "🎬 කරුණාකර සෙවිය යුතු වීඩියෝවේ නම ලබා දෙන්න." });

            await sock.sendMessage(from, { react: { text: '🔍', key: m.key } });

            // YouTube සෙවීම
            const result = await yts(text);
            const video = result.videos[0];

            if (!video) return sock.sendMessage(from, { text: "❌ වීඩියෝවක් හමු වූයේ නැත." });

            let response = `🎬 *BLOODY ROSE VIDEO INFO*\n\n` +
                `🎵 *Title:* ${video.title}\n` +
                `⏱️ *Duration:* ${video.timestamp}\n` +
                `👁️ *Views:* ${video.views}\n` +
                `📅 *Uploaded:* ${video.ago}\n` +
                `🔗 *URL:* ${video.url}\n\n` +
                `🌹 *Indumina Bot System*`;

            await sock.sendMessage(from, { 
                image: { url: video.thumbnail }, 
                caption: response 
            }, { quoted: m });

        } catch (e) {
            console.log(e);
            sock.sendMessage(from, { text: "❌ සොයාගැනීමට නොහැකි වුණා. පසුව උත්සාහ කරන්න." });
        }
    }
};