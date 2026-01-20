const axios = require('axios');

module.exports = {
    cmd: "lyrics",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const songName = args.join(' ');
            if (!songName) return sock.sendMessage(from, { text: "❌ කරුණාකර සින්දුවේ නම ලබා දෙන්න." });

            await sock.sendMessage(from, { react: { text: '🎵', key: m.key } });

            const res = await axios.get(`https://api.boxmine.xyz/search/lyrics?query=${encodeURIComponent(songName)}`);
            const data = res.data.result;

            if (!data || !data.lyrics) return sock.sendMessage(from, { text: "❌ පද වැල සොයාගත නොහැකි විය." });

            const lyricsMsg = `🎵 *LYRICS: ${data.title}* 🎵\n👤 *Artist:* ${data.artist}\n\n${data.lyrics}\n\n🌹 *Bloody Rose Bot*`;

            await sock.sendMessage(from, { text: lyricsMsg }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ පද වැල ලබා ගැනීම අසාර්ථක විය." });
        }
    }
};
