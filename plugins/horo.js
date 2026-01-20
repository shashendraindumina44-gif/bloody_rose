module.exports = {
    cmd: ["horo"],
    execution: async (sock, m, from, args) => {
        try {
            await sock.sendMessage(from, { react: { text: '🔮', key: m.key } });
            const results = ["අද වාසනාවන්තයි! 💰", "පරිස්සමින් ඉන්න. 🙊", "අලුත් යාළුවෙක් හම්බවෙයි. 🤝", "වැඩේ සාර්ථකයි! ✨"];
            const res = results[Math.floor(Math.random() * results.length)];
            await sock.sendMessage(from, { text: `🔮 *HOROSCOPE:* ${res}` }, { quoted: m });
        } catch (e) { console.log(e); }
    }
};