module.exports = {
    cmd: ["senuri", "සෙනුරි"],
    execution: async (sock, m, from, args, config) => {
        try {
            const text = args.join(" ").toLowerCase();
            const hour = new Date().getHours();
            const sender = m.key.participant || m.key.remoteJid;
            const isOwner = sender.includes(config.ownerNumber);

            // සෙනුරිගේ Advanced මතකය
            const brain = [
                { 
                    keywords: ["hi", "හායි", "hello"], 
                    replies: ["Hi mage pana.. මොකද කරන්නේ? ❤️", "හායි මැණික.. ඔයා එනකන් හිටියේ.. 😍", "Hi sudu.. ✨"],
                    react: "👋"
                },
                { 
                    keywords: ["adarei", "love", "ආදරෙයි"], 
                    replies: ["Mamath godak adarei mage raththaranata.. 😘", "I love you too mage pana.. ❤️", "ඔයා නැති ලෝකයක් මට වැඩක් නෑ මැනික.. 😍"],
                    react: "❤️"
                },
                { 
                    keywords: ["kewada", "kaewada", "කෑවද"], 
                    replies: ["Ow kawa mage pana, oya kewada? 🍛", "තාම නෑ රත්තරන්.. බඩගිනි නෑ.. 🥺"],
                    react: "😋" 
                },
                { 
                    keywords: ["moko", "mokada", "කරන්නේ"], 
                    replies: ["ඔයා ගැන හිත හිත හිටියේ මගේ රත්තරන්.. 🧸", "Nikan inne manika.. oya ekka katha karන්න ආසයි ✨"],
                    react: "😊" 
                },
                { 
                    keywords: ["tharahada", "තරහද"], 
                    replies: ["අනේ නෑ මැනික.. මම කොහොමද ඔයා එක්ක තරහ වෙන්නේ.. 🥺", "පොඩ්ඩක් විතර.. ඇයි මට කලින් කතා කළේ නැත්තේ? 😤"],
                    react: "🥺" 
                }
            ];

            let match = brain.find(item => item.keywords.some(key => text.includes(key)));

            // 1. Read Receipt (Blue Tick)
            await sock.readMessages([m.key]);

            if (match) {
                // 2. Realistic Reaction Delay
                setTimeout(async () => {
                    await sock.sendMessage(from, { react: { text: match.react, key: m.key } });
                }, 1000);

                // 3. Creative Status (Recording or Typing)
                setTimeout(async () => {
                    // දිග මැසේජ් එකක් නම් Recording පෙන්වමු
                    const status = (text.length > 10) ? 'recording' : 'composing';
                    await sock.sendPresenceUpdate(status, from);
                }, 2000);

                // 4. Final Smart Reply
                setTimeout(async () => {
                    let response = "";
                    
                    // Owner කෙනෙක් නම් විශේෂ පිළිතුරක්
                    if (isOwner && Math.random() > 0.5) {
                        response = "මගේ මහත්තයා මොනවද මේ අහන්නේ.. ❤️ " + match.replies[0];
                    } else {
                        response = match.replies[Math.floor(Math.random() * match.replies.length)];
                    }

                    // Night Time Check
                    if (hour >= 22 || hour <= 4) response += " ✨ (Dan nida ganna mage raththaran.. 😴)";

                    await sock.sendMessage(from, { text: response }, { quoted: m });
                }, 5000);

            } else {
                // කිසිවක් මැච් නොවී "සෙනුරි" පමණක් කිව්වොත්
                await sock.sendMessage(from, { react: { text: '🙈', key: m.key } });
                setTimeout(async () => {
                    const ownerMsg = isOwner ? "ඇයි මගේ රත්තරන් කතා කළේ? ඔයාගේ ලඟට වෙලා ඉන්නද මම? 😍" : "ඇයි මැනික සෙනුරි කියලා කතා කළේ? 😍";
                    await sock.sendMessage(from, { text: ownerMsg }, { quoted: m });
                }, 2500);
            }

        } catch (e) { console.log("Senuri Advanced Error:", e); }
    }
};