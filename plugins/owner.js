module.exports = {
    cmd: "owner",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        const vcard = 'BEGIN:VCARD\n' // ව්‍යාපාරික කාඩ්පතක හැඩය (VCard)
            + 'VERSION:3.0\n' 
            + `FN:${config.owner_name}\n` 
            + `ORG:Bloody Rose Bot;\n` 
            + `TEL;type=CELL;type=VOICE;waid=${config.owner_number[0]}:+${config.owner_number[0]}\n` 
            + 'END:VCARD';

        await sock.sendMessage(from, { 
            contacts: { 
                displayName: config.owner_name, 
                contacts: [{ vcard }] 
            }
        }, { quoted: m });
    }
};
