const yts = require('yt-search');

module.exports = {
    cmd: ["song", "play"],
    execution: async (sock, m, from, args) => {
        try {
            if (!args[0]) return await sock.sendMessage(from, { text: "❌ කරුණාකර සින්දුවේ නම ලබා දෙන්න." });

            await sock.sendMessage(from, { react: { text: '🔍', key: m.key } });

            const search = await yts(args.join(" "));
            const video = search.videos[0];
            if (!video) return await sock.sendMessage(from, { text: "❌ සින්දුව සොයාගත නොහැකි විය." });

            let infoText = `🎧 *B L O O D Y  R O S E  S O N G* 🎧\n\n🎵 *Title:* ${video.title}\n⏳ *Duration:* ${video.timestamp}\n\n> 📥 සින්දුව සොයමින් පවතී...`;

            await sock.sendMessage(from, { image: { url: video.thumbnail }, caption: infoText }, { quoted: m });
            await sock.sendMessage(from, { react: { text: '🎶', key: m.key } });

            // API 1 (පළවෙනි උත්සාහය)
            let api1 = `https://api.shizoke.site/api/download/dlmp3?url=${video.url}`;
            
            try {
                await sock.sendMessage(from, { 
                    audio: { url: api1 }, 
                    mimetype: 'audio/mpeg',
                    fileName: `${video.title}.mp3`
                }, { quoted: m });
            } catch (err) {
                // පළවෙනි එක වැඩ නැත්නම් API 2 (දෙවැනි උත්සාහය)
                let api2 = `https://api.vreden.my.id/api/ytmp3?url=${video.url}`;
                await sock.sendMessage(from, { 
                    audio: { url: api2 }, 
                    mimetype: 'audio/mpeg',
                    fileName: `${video.title}.mp3`
                }, { quoted: m });
            }

            await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

        } catch (e) {
            console.log("Song Error: ", e);
            await sock.sendMessage(from, { text: "❌ සර්වර් එකේ දෝෂයකි. කරුණාකර පසුව උත්සාහ කරන්න." });
        }
    }
};