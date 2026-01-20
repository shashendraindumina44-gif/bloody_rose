module.exports = {
    cmd: ["runtime", "uptime"],
    execution: async (sock, m, from) => {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const msg = `🕒 *BLOODY ROSE RUNTIME*\n\n🚀 පැය: ${hours}\n⏳ විනාඩි: ${minutes}\n⏱️ තත්පර: ${seconds}`;
        await sock.sendMessage(from, { text: msg }, { quoted: m });
    }
};