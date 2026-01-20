const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

module.exports = {
    cmd: ["s", "sticker"],
    execution: async (sock, m, from, args) => {
        try {
            // මැසේජ් එක image එකක්ද නැත්නම් image එකකට කරපු reply එකක්ද බලනවා
            const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage || m.message.imageMessage;
            const mime = m.message.imageMessage ? 'imageMessage' : (quoted?.imageMessage ? 'imageMessage' : null);

            if (!mime) return sock.sendMessage(from, { text: "📸 කරුණාකර පින්තූරයකට .s ලෙස Reply කරන්න." });

            await sock.sendMessage(from, { react: { text: '⏳', key: m.key } });

            // පින්තූරය බාගැනීම
            const stream = await downloadContentFromMessage(m.message.imageMessage || quoted.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const inputPath = path.join(__dirname, `../temp_input_${Date.now()}.jpg`);
            const outputPath = path.join(__dirname, `../temp_output_${Date.now()}.webp`);

            fs.writeFileSync(inputPath, buffer);

            // FFmpeg භාවිතයෙන් ස්ටිකර් එකක් බවට පත් කිරීම
            exec(`ffmpeg -i ${inputPath} -vcodec libwebp -filter:v "scale='if(gt(a,1),512,-1)':'if(gt(a,1),-1,512)',pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0.0,setsar=1" -lossless 1 ${outputPath}`, async (err) => {
                
                if (err) {
                    console.log(err);
                    return sock.sendMessage(from, { text: "❌ ස්ටිකර් එක සෑදීමේදී දෝෂයක්! (FFmpeg ඉන්ස්ටෝල් කර ඇත්දැයි බලන්න)" });
                }

                await sock.sendMessage(from, { sticker: fs.readFileSync(outputPath) }, { quoted: m });

                // වැඩේ ඉවර වුණාම temp files මකනවා
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
                await sock.sendMessage(from, { react: { text: '✅', key: m.key } });
            });

        } catch (e) {
            console.log(e);
            sock.sendMessage(from, { text: "❌ දෝෂයක් ඇති විය!" });
        }
    }
};