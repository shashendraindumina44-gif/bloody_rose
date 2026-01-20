module.exports = {
    cmd: ["msg"],
    execution: async (sock, m, from, args) => {
        try {
            const input = args.join(' ');
            if (!input.includes('|')) return sock.sendMessage(from, { text: "✍️ භාවිතය: .msg නම්බර් එක|මැසේජ් එක" });
            
            const [num, msg] = input.split('|');
            const target = num.trim() + "@s.whatsapp.net";
            
            await sock.sendMessage(target, { text: `📩 *ඔයාට රහසිගත පණිවිඩයක් ලැබුණා:* \n\n"${msg.trim()}"` });
            await sock.sendMessage(from, { text: "✅ පණිවිඩය සාර්ථකව යැව්වා!" });
        } catch (e) { sock.sendMessage(from, { text: "❌ යැවීමට නොහැකි වුණා." }); }
    }
};