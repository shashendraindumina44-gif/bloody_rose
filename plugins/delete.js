module.exports = {
    cmd: "del",
    isGroup: false,
    isOwner: true, // ඕනෑම කෙනෙක්ට මැකීමට ඉඩ දෙනවා නම් මෙය false කරන්න
    execution: async (sock, m, from, args, config) => {
        try {
            if (!m.message.extendedTextMessage?.contextInfo?.quotedMessage) return sock.sendMessage(from, { text: "❌ කරුණාකර බෝට්ගේ මැසේජ් එකකට Reply කර .del ලෙස ටයිප් කරන්න." });

            const key = {
                remoteJid: from,
                fromMe: true,
                id: m.message.extendedTextMessage.contextInfo.stanzaId
            };

            await sock.sendMessage(from, { delete: key });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ මැසේජ් එක මැකීමට නොහැකි විය." });
        }
    }
};
