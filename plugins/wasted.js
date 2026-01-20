module.exports = {
    cmd: ["rip", "funeral"],
    execution: async (sock, m, from, args) => {
        try {
            // 1. Tag කරපු කෙනා හෝ Reply කරපු කෙනාව ගමු
            let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender || m.sender;
            
            await sock.sendMessage(from, { react: { text: '🕯️', key: m.key } });

            // 2. ඒ කෙනාගේ DP එක ගමු
            let ppUrl;
            try {
                ppUrl = await sock.profilePictureUrl(user, 'image');
            } catch {
                ppUrl = 'https://i.ibb.co/3S8C6v5/logo.jpg'; // DP එක නැත්නම් default එකක්
            }

            // 3. Canvas API එකක් පාවිච්චි කරලා මල් වඩමේ පින්තූරය හදමු
            // සටහන: මෙහිදී අපි ලස්සන 'RIP' හෝ 'Funeral' Frame එකක් සහිත API එකක් භාවිතා කරනවා
            let ripApi = `https://some-random-api.com/canvas/overlay/passed?avatar=${encodeURIComponent(ppUrl)}`;

            // 4. පින්තූරය යවමු
            await sock.sendMessage(from, { 
                image: { url: ripApi }, 
                caption: `🙏 *REST IN PEACE* @${user.split('@')[0]}\n\nඅප අතරින් වෙන් වූ ඔබ සැමට නිවන් සුව පතමු! 🥀`,
                mentions: [user]
            }, { quoted: m });

        } catch (e) {
            console.log("RIP Error: ", e);
            await sock.sendMessage(from, { text: "❌ RIP Frame එක සෑදීමේදී දෝෂයක් විය." });
        }
    }
};