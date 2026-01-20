module.exports = {
    cmd: ["fancy", "font", "style"],
    execution: async (sock, m, from, args) => {
        try {
            const text = args.join(' ');
            if (!text) return sock.sendMessage(from, { text: "✍️ කරුණාකර වචනයක් ලබා දෙන්න. (උදා: .fancy Hello)" });

            await sock.sendMessage(from, { react: { text: '✨', key: m.key } });

            // API එකක් නැතුව බෝට් එක ඇතුළෙම Font එක මාරු කරන හැටි
            const style = (t) => {
                return t.replace(/[a-zA-Z]/g, v => {
                    const charCode = v.charCodeAt(0);
                    // මෙතනදී අකුරු ලස්සන අකුරු වලට Convert කරයි
                    return String.fromCharCode(charCode > 96 ? charCode + 119951 : charCode + 120013);
                });
            };

            const fancyResult = style(text);
            let response = `✨ *BLOODY ROSE FANCY FONTS* ✨\n\n` +
                           `*Result:* ${fancyResult}\n\n` +
                           `🌹 *Created by Indumina*`;

            await sock.sendMessage(from, { text: response }, { quoted: m });

        } catch (e) {
            console.log(e);
            sock.sendMessage(from, { text: "❌ දෝෂයක් ඇති විය!" });
        }
    }
};