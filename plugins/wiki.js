const axios = require('axios');

module.exports = {
    cmd: "wiki",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const query = args.join(' ');
            if (!query) return sock.sendMessage(from, { text: "❌ කරුණාකර සෙවිය යුතු දේ ලබා දෙන්න. (උදා: .wiki WhatsApp)" });

            await sock.sendMessage(from, { text: `🔍 මම *${query}* ගැන විස්තර සොයමින් පවතිනවා... 🌹` }, { quoted: m });

            // Wikipedia API එක හරහා විස්තර ලබා ගැනීම
            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await axios.get(url);

            if (response.data.type === 'disambiguation') {
                return sock.sendMessage(from, { text: `❌ ඔබ සෙවූ නමින් ප්‍රතිඵල කිහිපයක් තිබේ. කරුණාකර වඩාත් නිවැරදි නමක් ලබා දෙන්න.` });
            }

            const replyText = `🌹 *WIKIPEDIA SEARCH* 🌹\n\n` +
                              `📚 *Title:* ${response.data.title}\n\n` +
                              `📖 *Description:* ${response.data.extract}\n\n` +
                              `🔗 *Read more:* ${response.data.content_urls.desktop.page}`;

            // පින්තූරයක් තිබේ නම් එය සමඟ විස්තරය යැවීම
            if (response.data.thumbnail) {
                await sock.sendMessage(from, { 
                    image: { url: response.data.thumbnail.source }, 
                    caption: replyText 
                }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text: replyText }, { quoted: m });
            }

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: "❌ මට ඒ ගැන විස්තර සොයාගත නොහැකි විය. කරුණාකර ඉංග්‍රීසි බසින් සොයන්න." });
        }
    }
};
