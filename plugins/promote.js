module.exports = {
    cmd: "promote",
    isGroup: true,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        const user = m.message.extendedTextMessage?.contextInfo?.participant;
        if (!user) return sock.sendMessage(from, { text: "👤 Admin දෙන්න ඕන කෙනාගේ මැසේජ් එකකට Reply කරන්න." });

        await sock.groupParticipantsUpdate(from, [user], "promote");
        await sock.sendMessage(from, { text: "👑 සාර්ථකව Admin තනතුර ලබා දුන්නා." });
    }
};
