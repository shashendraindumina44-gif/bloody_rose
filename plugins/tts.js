const googleTTS = require('google-tts-api');

module.exports = {
    cmd: ["say", "tts", "speak"],
    execution: async (sock, m, from, args) => {
        try {
            const text = args.join(' ');
            if (!text) return sock.sendMessage(from, { text: "🗣️ කරුණාකර මට කියවන්න ඕන දේ ලියන්න. (උදා: .say හෙලෝ ඉන්දුමින)" });

            await sock.sendMessage(from, { react: { text: '🗣️', key: m.key } });

            // Google TTS හරහා Voice ලින්ක් එකක් සාදා ගැනීම
            const url = googleTTS.getAudioUrl(text, {
                lang: 'si', // සිංහල භාෂාව (ඔයාට ඕන නම් 'en' දාලා English කරන්නත් පුළුවන්)
                slow: false,
                host: 'https://translate.google.com',
            });

            // Audio එක යැවීම
            await sock.sendMessage(from, { 
                audio: { url: url }, 
                mimetype: 'audio/mp4', 
                ptt: true // මේක true කළාම Voice Message එකක් වගේ යනවා
            }, { quoted: m });

        } catch (e) {
            console.log(e);
            sock.sendMessage(from, { text: "❌ මට කතා කරන්න බැරි වුණා!" });
        }
    }
};