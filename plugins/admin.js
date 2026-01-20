module.exports = {
    cmd: ["kick", "mute", "unmute", "tagall"],
    execution: async (sock, m, from, args) => {
        try {
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const groupMetadata = m.isGroup ? await sock.groupMetadata(from) : {};
            const participants = m.isGroup ? groupMetadata.participants : [];
            const admins = participants.filter(p => p.admin !== null).map(p => p.id);
            
            const isBotAdmin = admins.includes(botNumber);
            const isUserAdmin = admins.includes(m.sender);

            if (!m.isGroup) return await sock.sendMessage(from, { text: "❌ මේක Group එකක විතරයි පාවිච්චි කරන්න පුළුවන්." });
            if (!isUserAdmin) return await sock.sendMessage(from, { text: "❌ මේක පාවිච්චි කරන්න ඔයා Admin කෙනෙක් වෙන්න ඕනේ." });
            if (!isBotAdmin) return await sock.sendMessage(from, { text: "❌ මට Admin පවර්ස් නැතුව මේක කරන්න බැහැ." });

            const command = m.body.slice(1).trim().split(/ +/).shift().toLowerCase();

            // 1. KICK COMMAND
            if (command === "kick") {
                let user = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || m.quoted?.sender;
                if (!user) return await sock.sendMessage(from, { text: "❌ අයින් කරන්න ඕන කෙනාව Tag කරන්න හෝ Reply කරන්න." });
                await sock.groupParticipantsUpdate(from, [user], "remove");
                return await sock.sendMessage(from, { text: "✅ සාර්ථකව ඉවත් කළා." });
            }

            // 2. MUTE COMMAND
            if (command === "mute") {
                await sock.groupSettingUpdate(from, "announcement");
                return await sock.sendMessage(from, { text: "🔇 Group එක නිහඬ කළා. (Admins Only)" });
            }

            // 3. UNMUTE COMMAND
            if (command === "unmute") {
                await sock.groupSettingUpdate(from, "not_announcement");
                return await sock.sendMessage(from, { text: "🔊 Group එක විවෘත කළා. (Everyone)" });
            }

            // 4. TAGALL COMMAND
            if (command === "tagall") {
                let message = args.join(" ") || "B L O O D Y  R O S E  T A G  A L L";
                let tagMsg = `📢 *MESSAGE:* ${message}\n\n`;
                for (let mem of participants) {
                    tagMsg += ` @${mem.id.split('@')[0]}`;
                }
                return await sock.sendMessage(from, { text: tagMsg, mentions: participants.map(a => a.id) });
            }

        } catch (e) {
            console.log("Admin Error: ", e);
        }
    }
};