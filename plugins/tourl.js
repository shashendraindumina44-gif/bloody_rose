const axios = require('axios');
const FormData = require('form-data');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    cmd: "tourl",
    isGroup: false,
    isOwner: false,
    execution: async (sock, m, from, args, config) => {
        try {
            const quoted = m.message?.extendedTextMessage?.contextInfo;
            const msg = quoted?.quotedMessage;

            let mediaType;
            if (msg?.imageMessage) mediaType = 'image';
            else if (msg?.videoMessage) mediaType = 'video';
            else if (msg?.audioMessage) mediaType = 'audio';
            else if (msg?.documentMessage) mediaType = 'document';

            if (!quoted || !mediaType) {
                return await sock.sendMessage(from, { text: '❌ *කරුණාකර Image හෝ Video එකකට Reply කරන්න.*' });
            }

            await sock.sendMessage(from, { react: { text: '⏳', key: m.key } });

            // Media එක Download කිරීම
            const mediaKey = msg[`${mediaType}Message`];
            const stream = await downloadContentFromMessage(mediaKey, mediaType);
            let buffer = Buffer.alloc(0);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

            // Catbox API එකට Upload කිරීම (වඩාත් ස්ථාවරයි)
            const form = new FormData();
            form.append('reqtype', 'fileupload');
            form.append('fileToUpload', buffer, { filename: `bloody.${mediaKey.mimetype.split('/')[1]}` });

            const response = await axios.post('https://catbox.moe/user/api.php', form, {
                headers: { ...form.getHeaders() }
            });

            const resultUrl = response.data; // මෙතන කෙලින්ම URL එක ලැබෙනවා

            const caption = `🔗 *BLOODY ROSE UPLOADER*\n\n` +
                            `📂 *Type:* ${mediaType.toUpperCase()}\n` +
                            `🌐 *URL:* ${resultUrl}\n\n` +
                            `🌹 *Bloody Rose Bot*`;

            await sock.sendMessage(from, { text: caption }, { quoted: m });
            await sock.sendMessage(from, { react: { text: '✅', key: m.key } });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { text: '❌ *API Error: ගොනුව Upload කිරීමට නොහැකි විය.*' });
        }
    }
};
