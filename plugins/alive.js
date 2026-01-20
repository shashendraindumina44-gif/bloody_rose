module.exports = {
    cmd: ["alive", "bot", "status"],
    execution: async (sock, m, from, args) => {
        try {
            const aliveMsg = `🌹 *BLOODY ROSE MD IS ALIVE* 🌹

👤 *Owner:* Indumina
⚙️ *Prefix:* .
🎶 *Song/Video:* Working ✅
🚀 *Bot Status:* Online

> Created by Indumina 🇱🇰`;

            // Reaction එකක් දාමු
            await sock.sendMessage(from, { react: { text: '🌹', key: m.key } });

            // මැසේජ් එක යවමු (Image එකක් නැතුව සරලව)
            await sock.sendMessage(from, { 
                text: aliveMsg,
                contextInfo: {
                    externalAdReply: {
                        title: "BLOODY ROSE MD",
                        body: "Indumina's WhatsApp Bot",
                        sourceUrl: "https://github.com/", // ඔයාගේ ලින්ක් එකක් දෙන්න පුළුවන්
                        mediaType: 1,
                        renderLargerThumbnail: false
                    }
                }
            }, { quoted: m });

        } catch (e) {
            console.log("Alive Error: ", e);
            sock.sendMessage(from, { text: "❌ Alive පද්ධතියේ දෝෂයක්!" });
        }
    }
};