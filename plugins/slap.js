module.exports = {
    cmd: ["slap"],
    execution: async (sock, m, from, args) => {
        try {
            // 1. Reaction එකක් දාමු
            await sock.sendMessage(from, { react: { text: '🖐️', key: m.key } });

            // 2. කාවද ටැග් කරලා තියෙන්නේ කියලා බලමු (ක්‍රම කිහිපයකටම බලනවා)
            let mention = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                          m.message?.extendedTextMessage?.contextInfo?.participant ||
                          (m.quoted ? m.quoted.sender : null);

            // 3. කිසිවෙක් ටැග් කරලා නැත්නම් විහිළුවක් කරමු
            if (!mention) {
                return await sock.sendMessage(from, { 
                    text: "❌ කාටද ගහන්න ඕනේ? කෙනෙක්ව Tag කරන්න හෝ පණිවිඩයකට Reply කරන්න. නැත්නම් මම ඔයාටම ගහනවා! 😂" 
                }, { quoted: m });
            }

            // 4. සාර්ථකව පණිවිඩය යැවීම
            const slapMsg = `🖐️ *B L O O D Y  S L A P* 🖐️\n\n@${m.sender.split('@')[0]} විසින් @${mention.split('@')[0]} ගේ කම්මුල රතු වෙන්නම පාරක් දුන්නා! 😂`;

            await sock.sendMessage(from, { 
                text: slapMsg,
                mentions: [m.sender, mention]
            }, { quoted: m });

        } catch (e) {
            console.log("Slap Error: ", e);
            // Error එකක් ආවොත් සරල මැසේජ් එකක් යවමු
            await sock.sendMessage(from, { text: "🖐️ පාරක් දුන්නා! (Error: Mention Not Found)" });
        }
    }
};