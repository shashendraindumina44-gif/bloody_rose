module.exports = {
    cmd: ["kill"],
    execution: async (sock, m, from, args) => {
        try {
            // 1. Tag කරපු කෙනා හෝ Reply කරපු කෙනාව ගමු
            let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender;
            
            await sock.sendMessage(from, { react: { text: '⚰️', key: m.key } });

            // 2. ඒ කෙනාගේ DP එක ගමු
            let ppUrl;
            try {
                ppUrl = await sock.profilePictureUrl(user, 'image');
            } catch {
                ppUrl = 'https://i.ibb.co/3S8C6v5/logo.jpg'; // DP එක නැත්නම් default එකක්
            }

            // 3. Wasted Filter එක දාපු API එකක් පාවිච්චි කරලා පින්තූරය හදමු
            let wastedApi = `https://some-random-api.com/canvas/overlay/wasted?display_name=WASTED&avatar=${encodeURIComponent(ppUrl)}`;

            // 4. පින්තූරය යවමු
            await sock.sendMessage(from, { 
                image: { url: wastedApi }, 
                caption: `💀 *REST IN PEACE* @${user.split('@')[0]}\n\nනීච කුලයේ මරණයක් සිදු වී ඇත!`,
                mentions: [user]
            }, { quoted: m });

        } catch (e) {
            console.log("Wasted Error: ", e);
            await sock.sendMessage(from, { text: "❌ පින්තූරය සෑදීමේදී දෝෂයක් විය." });
        }
    }
};