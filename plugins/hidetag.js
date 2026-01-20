module.exports = {
    cmd: "hidetag",
    isGroup: true,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        const isUserAdmin = participants.find(p => p.id === m.sender)?.admin;

        if (!isUserAdmin) return sock.sendMessage(from, { text: "❌ මෙය Admin ලාට පමණි." });

        const message = args.join(' ') || "Hello everyone! 🌹";
        
        await sock.sendMessage(from, { 
            text: message, 
            mentions: participants.map(a => a.id) 
        });
    }
};
