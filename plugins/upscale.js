const axios = require('axios');

module.exports = {
    cmd: "hd",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const quoted = m.message?.extendedTextMessage?.contextInfo;
            if (!quoted || !quoted.quotedMessage?.imageMessage) {
                return sock.sendMessage(from, { text: "📸 කරුණාකර HD කිරීමට අවශ්‍ය පින්තූරයට Reply කරන්න." });
            }

            await sock.sendMessage(from, { react: { text: '✨', key: m.key } });

            // Media එක download කරලා buffer එකක් කරගැනීම
            const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
            const stream = await downloadContentFromMessage(quoted.quotedMessage.imageMessage, 'image');
            let buffer = Buffer.alloc(0);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            // AI Upscale API එකකට යැවීම
            const FormData = require('form-data');
            const form = new FormData();
            form.append('image', buffer, { filename: 'upscale.jpg' });

            const res = await axios.post('https://api.boxmine.xyz/ai/upscale', form, {
                headers: { ...form.getHeaders() }
            });

            if (res.data && res.data.result) {
                await sock.sendMessage(from, { image: { url: res.data.result }, caption: "🌹 *HD Image Success!*" }, { quoted: m });
            } else {
                throw new Error("Conversion failed");
            }

            await sock.sendMessage(from, { react: { text: '✅', key: m.key } });
        } catch (e) {
            await sock.sendMessage(from, { text: "❌ පින්තූරය HD කිරීමට නොහැකි විය." });
        }
    }
};
