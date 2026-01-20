module.exports = {
    cmd: "tagall",
    isGroup: true,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const metadata = await sock.groupMetadata(from);
            const participants = metadata.participants;
            
            // බෝට් ඇඩ්මින්දැයි පරීක්ෂා කිරීම
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = participants.find(p => p.id === botId)?.admin;

            if (!isBotAdmin) return sock.sendMessage(from, { text: "❌ මට මේ වැඩේ කරන්න බෑ, මම මේ Group එකේ Admin කෙනෙක් නෙවෙයි." });

            let text = `🌹 *TAG ALL* 🌹\n\n`;
            for (let mem of participants) {
                text += `📍 @${mem.id.split('@')[0]}\n`;
            }
            await sock.sendMessage(from, { text: text, mentions: participants.map(a => a.id) }, { quoted: m });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ දෝෂයක් ඇති විය." });
        }
    }
};
