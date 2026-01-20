const axios = require('axios');

module.exports = {
    cmd: ["img", "image", "පින්තූර"],
    execution: async (sock, m, from, args) => {
        try {
            const query = args.join(" ");
            const sender = m.key.participant || m.key.remoteJid;

            if (!query) return sock.sendMessage(from, { text: "පින්තූරයක් හොයන්න නමක් දෙන්න. (Ex: .img car)" }, { quoted: m });

            await sock.sendMessage(from, { react: { text: '🔍', key: m.key } });

            // Google Images සෙවුම (Creative Scraper)
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`;
            const response = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            // HTML එක ඇතුළෙන් Image URL එකක් හොයාගන්නා හැටි
            const body = response.data;
            const imgLinks = body.match(/https?:\/\/[^"']+\.(?:png|jpg|jpeg)/gi);

            if (!imgLinks || imgLinks.length < 5) {
                return sock.sendMessage(from, { text: "අයියෝ, ඔය නමට පින්තූරයක් හොයාගන්න බැරි වුණා. වෙන එකක් ගහන්න. 🌹🩸" });
            }

            // මුල් පින්තූර ටිකෙන් එකක් අහඹු ලෙස තෝරා ගැනීම
            const randomImg = imgLinks[Math.floor(Math.random() * Math.min(imgLinks.length, 10))];

            // පින්තූරය Buffer එකක් ලෙස ලබා ගැනීම (Error එක නැතිවීමට ප්‍රධාන හේතුව මෙයයි)
            const imageBuffer = await axios.get(randomImg, { responseType: 'arraybuffer' });

            await sock.sendMessage(from, { 
                image: Buffer.from(imageBuffer.data), 
                caption: `📸 *BLOODY ROSE IMAGE ENGINE* 🌹🩸\n\n🔍 *සෙවුම:* ${query}\n👤 *ඉල්ලුවේ:* @${sender.split("@")[0]}\n\n🗣️ *Owner:* Lord Indumina`,
                mentions: [sender]
            }, { quoted: m });

        } catch (e) {
            console.log("Error in IMG command:", e);
            await sock.sendMessage(from, { text: "පොඩි ලෙඩක් ආවා, ආයේ ට්‍රයි කරපන් මචං!🌹🩸" });
        }
    }
};