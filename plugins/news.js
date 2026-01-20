const axios = require('axios');

module.exports = {
    cmd: "news",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            await sock.sendMessage(from, { react: { text: '📰', key: m.key } });

            // ලංකාවේ ප්‍රවෘත්ති ලබාගන්නා API එකක්
            const res = await axios.get(`https://api.boxmine.xyz/news/itn`); // ITN හෝ පුවත් මූලාශ්‍රයක්
            const news = res.data.result;

            let newsMsg = `📰 *LATEST NEWS UPDATE* 📰\n\n`;
            newsMsg += `📌 *Title:* ${news.title}\n\n`;
            newsMsg += `📖 *Description:* ${news.description}\n\n`;
            newsMsg += `🔗 *Read More:* ${news.url}\n\n`;
            newsMsg += `🌹 *Bloody Rose News*`;

            if (news.image) {
                await sock.sendMessage(from, { image: { url: news.image }, caption: newsMsg }, { quoted: m });
            } else {
                await sock.sendMessage(from, { text: newsMsg }, { quoted: m });
            }
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ පුවත් ලබා ගැනීම අසාර්ථක විය." });
        }
    }
};
