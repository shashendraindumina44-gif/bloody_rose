const QRCode = require('qrcode');
const fs = require('fs-extra');

module.exports = {
    cmd: "qr",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const text = args.join(' ');
            if (!text) return sock.sendMessage(from, { text: "❌ කරුණාකර QR එකක් සෑදීමට ලින්ක් එකක් හෝ වචනයක් ලබා දෙන්න." });

            const filePath = `./${m.key.id}.png`;
            await QRCode.toFile(filePath, text);

            await sock.sendMessage(from, { 
                image: { url: filePath }, 
                caption: `🌹 *QR CODE GENERATED* 🌹\n\n📍 *Content:* ${text}` 
            }, { quoted: m });

            fs.unlinkSync(filePath); // ෆයිල් එක මකා දැමීම
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ QR Code එක සෑදීම අසාර්ථක විය." });
        }
    }
};
